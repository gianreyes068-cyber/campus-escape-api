const sessionService = require('./session.service');
const repository = require('../repositories/session-player.repository');
const { sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const { badRequest, conflict, forbidden, notFound } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function findOne(sql, replacements, transaction) {
  const rows = await sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements,
    transaction,
  });

  return rows[0] || null;
}

async function join(joinCode, nickname, user) {
  const session = await sessionService.getByCode(joinCode);

  // A returning account keeps its original seat and nickname.
  const existingSeat = await repository.findSeat(
    session.session_id,
    user.user_id
  );

  if (existingSeat) {
    return { session, player: existingSeat, created: false };
  }

  // Only new players may join while the session is waiting.
  if (session.status !== 'waiting') {
    throw conflict(
      'SESSION_NOT_JOINABLE',
      'This session is not accepting new players.'
    );
  }

  try {
    const player = await repository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
    });

    return { session, player, created: true };
  } catch (error) {
    if (constraintOf(error) !== 'uq_session_players_session_user') {
      throw error;
    }

    const seatCreatedByOtherRequest = await repository.findSeat(
      session.session_id,
      user.user_id
    );

    if (!seatCreatedByOtherRequest) {
      throw error;
    }

    return {
      session,
      player: seatCreatedByOtherRequest,
      created: false,
    };
  }
}

async function answer(joinCode, questionId, choiceIndex, user) {
  return sequelize.transaction(async (transaction) => {
    const session = await findOne(
      `SELECT session_id, question_set_id, status
       FROM sessions
       WHERE join_code = :joinCode
       FOR UPDATE`,
      { joinCode },
      transaction
    );

    if (!session) {
      throw notFound(
        'SESSION_NOT_FOUND',
        `No session has the join code ${joinCode}.`
      );
    }

    if (session.status !== 'playing') {
      throw conflict(
        'SESSION_NOT_PLAYING',
        'Answers can only be submitted while the session is playing.'
      );
    }

    const player = await findOne(
      `SELECT player_id, score, current_stage
       FROM session_players
       WHERE session_id = :sessionId AND user_id = :userId
       FOR UPDATE`,
      { sessionId: session.session_id, userId: user.user_id },
      transaction
    );

    if (!player) {
      throw forbidden('Join this session before submitting an answer.');
    }

    const question = await findOne(
      `SELECT question_id, correct_index
       FROM questions
       WHERE question_id = :questionId
         AND question_set_id = :questionSetId`,
      { questionId, questionSetId: session.question_set_id },
      transaction
    );

    if (!question) {
      throw notFound(
        'QUESTION_NOT_FOUND',
        'That question does not belong to this session.'
      );
    }

    const choice = await findOne(
      `SELECT choice_index
       FROM question_choices
       WHERE question_id = :questionId AND choice_index = :choiceIndex`,
      { questionId, choiceIndex },
      transaction
    );

    if (!choice) {
      throw badRequest(
        'INVALID_CHOICE',
        'That choice does not belong to this question.'
      );
    }

    const existingAnswer = await findOne(
      `SELECT answer_id
       FROM answers
       WHERE player_id = :playerId AND question_id = :questionId`,
      { playerId: player.player_id, questionId },
      transaction
    );

    if (existingAnswer) {
      throw conflict(
        'QUESTION_ALREADY_ANSWERED',
        'You have already answered this question.'
      );
    }

    const isCorrect =
      Number(choiceIndex) === Number(question.correct_index);

    await sequelize.query(
      `INSERT INTO answers (player_id, question_id, choice_index, is_correct)
       VALUES (:playerId, :questionId, :choiceIndex, :isCorrect)`,
      {
        replacements: {
          playerId: player.player_id,
          questionId,
          choiceIndex,
          isCorrect,
        },
        transaction,
      }
    );

    const total = await findOne(
      `SELECT COUNT(*)::int AS total
       FROM questions
       WHERE question_set_id = :questionSetId`,
      { questionSetId: session.question_set_id },
      transaction
    );

    const answered = await findOne(
      `SELECT COUNT(DISTINCT a.question_id)::int AS count
       FROM answers a
       JOIN questions q ON q.question_id = a.question_id
       WHERE a.player_id = :playerId
         AND q.question_set_id = :questionSetId`,
      {
        playerId: player.player_id,
        questionSetId: session.question_set_id,
      },
      transaction
    );

    const completed = Number(answered.count) >= Number(total.total);
    const currentStage = completed ? 'gate' : 'ict';
    const points = isCorrect ? 10 : 0;

    const updated = await findOne(
      `UPDATE session_players
       SET score = score + :points,
           current_stage = :currentStage
       WHERE player_id = :playerId
       RETURNING score, current_stage`,
      {
        points,
        currentStage,
        playerId: player.player_id,
      },
      transaction
    );

    return {
      question_id: question.question_id,
      correct: isCorrect,
      score: Number(updated.score),
      current_stage: updated.current_stage,
      completed,
    };
  });
}

module.exports = { join, answer };