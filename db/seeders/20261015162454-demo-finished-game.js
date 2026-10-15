'use strict';

const { QueryTypes } = require('sequelize');

const GAME_CODE = '481263';
const SET_TITLE = 'Campus Escape Demo Quiz';

async function getOne(queryInterface, sql, replacements, transaction) {
  const rows = await queryInterface.sequelize.query(sql, {
    replacements,
    transaction,
    type: QueryTypes.SELECT,
  });

  if (!rows[0]) {
    throw new Error('Expected database row was not found while creating demo game.');
  }

  return rows[0];
}

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const host = await getOne(
        queryInterface,
        'SELECT user_id FROM "users" WHERE email = :email',
        { email: 'host@campusescape.test' },
        transaction
      );

      const playerEmails = [
        'mia@campusescape.test',
        'noe@campusescape.test',
        'luz@campusescape.test',
      ];

      const players = [];
      for (const email of playerEmails) {
        players.push(
          await getOne(
            queryInterface,
            'SELECT user_id FROM "users" WHERE email = :email',
            { email },
            transaction
          )
        );
      }

      const now = new Date();
      const startedAt = new Date(now.getTime() - 360 * 1000);

      const questionSet = await getOne(
        queryInterface,
        `INSERT INTO "question_sets"
          (user_id, title, description, subject, grade_level, created_at)
         VALUES
          (:userId, :title, :description, :subject, :gradeLevel, :createdAt)
         RETURNING question_set_id`,
        {
          userId: host.user_id,
          title: SET_TITLE,
          description: 'Fictional sample quiz for the database lab.',
          subject: 'Computer Science',
          gradeLevel: 'College',
          createdAt: now,
        },
        transaction
      );

      const questionData = [
        {
          text: 'Which device forwards data between networks?',
          choices: ['Monitor', 'Router', 'Keyboard', 'Printer'],
          correctIndex: 1,
        },
        {
          text: 'Which language is commonly used to query relational databases?',
          choices: ['SQL', 'HTML', 'CSS', 'PNG'],
          correctIndex: 0,
        },
        {
          text: 'What does a primary key identify?',
          choices: [
            'A database server',
            'A table description',
            'A unique row',
            'A network cable',
          ],
          correctIndex: 2,
        },
      ];

      const questions = [];

      for (const item of questionData) {
        const question = await getOne(
          queryInterface,
          `INSERT INTO "questions"
            (question_set_id, question_text, question_type,
             difficulty_level, time_limit_sec, correct_index)
           VALUES
            (:questionSetId, :questionText, 'multiple_choice', 1, 20, :correctIndex)
           RETURNING question_id`,
          {
            questionSetId: questionSet.question_set_id,
            questionText: item.text,
            correctIndex: item.correctIndex,
          },
          transaction
        );

        questions.push({ ...item, questionId: question.question_id });

        await queryInterface.bulkInsert(
          'question_choices',
          item.choices.map((choiceText, choiceIndex) => ({
            question_id: question.question_id,
            choice_index: choiceIndex,
            choice_text: choiceText,
          })),
          { transaction }
        );
      }

      const session = await getOne(
        queryInterface,
        `INSERT INTO "sessions"
          (question_set_id, join_code, status, duration_sec, started_at, ended_at)
         VALUES
          (:questionSetId, :joinCode, 'ended', 360, :startedAt, :endedAt)
         RETURNING session_id`,
        {
          questionSetId: questionSet.question_set_id,
          joinCode: GAME_CODE,
          startedAt,
          endedAt: now,
        },
        transaction
      );

      const nicknames = ['Mia', 'Noe', 'Luz'];

      await queryInterface.bulkInsert(
        'seats',
        players.map((player, index) => ({
          session_id: session.session_id,
          user_id: player.user_id,
          nickname: nicknames[index],
          score: 100,
          current_stage: 'gate',
          time_penalty_sec: 0,
          token_expires_at: null,
        })),
        { transaction }
      );

      const seats = await queryInterface.sequelize.query(
        `SELECT seat_id, nickname
         FROM "seats"
         WHERE session_id = :sessionId`,
        {
          replacements: { sessionId: session.session_id },
          transaction,
          type: QueryTypes.SELECT,
        }
      );

      const seatByNickname = new Map(seats.map((seat) => [seat.nickname, seat]));

      const answerRows = [];
      for (const nickname of nicknames) {
        const seat = seatByNickname.get(nickname);
        for (const question of questions) {
          answerRows.push({
            seat_id: seat.seat_id,
            question_id: question.questionId,
            choice_index: question.correctIndex,
            is_correct: true,
            answered_at: now,
          });
        }
      }

      await queryInterface.bulkInsert('answers', answerRows, { transaction });

      await queryInterface.bulkInsert(
        'reward_claims',
        nicknames.map((nickname, index) => ({
          seat_id: seatByNickname.get(nickname).seat_id,
          target_seat_id: null,
          stage: ['computer_lab', 'ccb', 'ict'][index],
          box_index: index + 1,
          points_awarded: 100,
          claimed_at: now,
        })),
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    const replacements = { gameCode: GAME_CODE, setTitle: SET_TITLE };

    try {
      await queryInterface.sequelize.query(
        `DELETE FROM "reward_claims"
         WHERE seat_id IN (
           SELECT seat_id FROM "seats"
           WHERE session_id IN (
             SELECT session_id FROM "sessions" WHERE join_code = :gameCode
           )
         )`,
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        `DELETE FROM "answers"
         WHERE seat_id IN (
           SELECT seat_id FROM "seats"
           WHERE session_id IN (
             SELECT session_id FROM "sessions" WHERE join_code = :gameCode
           )
         )`,
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        `DELETE FROM "seats"
         WHERE session_id IN (
           SELECT session_id FROM "sessions" WHERE join_code = :gameCode
         )`,
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        'DELETE FROM "sessions" WHERE join_code = :gameCode',
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        `DELETE FROM "question_choices"
         WHERE question_id IN (
           SELECT question_id FROM "questions"
           WHERE question_set_id IN (
             SELECT question_set_id FROM "question_sets" WHERE title = :setTitle
           )
         )`,
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        `DELETE FROM "questions"
         WHERE question_set_id IN (
           SELECT question_set_id FROM "question_sets" WHERE title = :setTitle
         )`,
        { replacements, transaction }
      );

      await queryInterface.sequelize.query(
        'DELETE FROM "question_sets" WHERE title = :setTitle',
        { replacements, transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
