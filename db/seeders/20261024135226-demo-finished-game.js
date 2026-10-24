'use strict';

const HOST_EMAIL = 'host@campus.test';
const PLAYER_EMAILS = [
  'aster@campus.test',
  'basil@campus.test',
  'cora@campus.test',
  'dune@campus.test',
];
const SET_TITLE = 'Campus Escape Demo';
const JOIN_CODE = '581204';

module.exports = {
  async up(queryInterface, Sequelize) {
    const select = (sql, replacements) =>
      queryInterface.sequelize.query(sql, {
        replacements,
        type: Sequelize.QueryTypes.SELECT,
      });

    // Find the host account; do not hard-code generated IDs.
    const [host] = await select(
      'SELECT user_id FROM users WHERE email = :email',
      { email: HOST_EMAIL }
    );
    if (!host) throw new Error('Run the demo-users seeder first.');

    // Create and find the question set.
    await queryInterface.bulkInsert('question_sets', [{
      user_id: host.user_id,
      title: SET_TITLE,
      description: 'Fictional seed data for Campus Escape.',
      subject: 'Campus knowledge',
      grade_level: 'College',
      created_at: new Date(),
    }]);

    const [questionSet] = await select(
      `SELECT question_set_id FROM question_sets
       WHERE user_id = :userId AND title = :title`,
      { userId: host.user_id, title: SET_TITLE }
    );

    // Create one question and its four choices.
    const questionText = 'Which campus is the setting for this game?';

    await queryInterface.bulkInsert('questions', [{
      question_set_id: questionSet.question_set_id,
      question_text: questionText,
      question_type: 'multiple_choice',
      difficulty_level: 1,
      time_limit_sec: 20,
      correct_index: 0,
    }]);

    const [question] = await select(
      `SELECT question_id FROM questions
       WHERE question_set_id = :setId AND question_text = :questionText`,
      { setId: questionSet.question_set_id, questionText }
    );

    await queryInterface.bulkInsert('question_choices', [
      { question_id: question.question_id, choice_index: 0, choice_text: 'Bulan Campus' },
      { question_id: question.question_id, choice_index: 1, choice_text: 'Main Campus' },
      { question_id: question.question_id, choice_index: 2, choice_text: 'West Campus' },
      { question_id: question.question_id, choice_index: 3, choice_text: 'East Campus' },
    ]);

    // Create an ended session.
    const startedAt = new Date('2026-10-01T09:00:00Z');
    const endedAt = new Date('2026-10-01T09:06:00Z');

    await queryInterface.bulkInsert('sessions', [{
      question_set_id: questionSet.question_set_id,
      join_code: JOIN_CODE,
      status: 'ended',
      duration_sec: 360,
      started_at: startedAt,
      ended_at: endedAt,
    }]);

    const [session] = await select(
      'SELECT session_id FROM sessions WHERE join_code = :joinCode',
      { joinCode: JOIN_CODE }
    );

    const users = await select(
      'SELECT user_id, email FROM users WHERE email IN (:emails)',
      { emails: PLAYER_EMAILS }
    );
    const userByEmail = Object.fromEntries(
      users.map((user) => [user.email, user.user_id])
    );

    if (PLAYER_EMAILS.some((email) => !userByEmail[email])) {
      throw new Error('One or more demo player accounts are missing.');
    }

    // Three players reached the gate; Dune stopped earlier. Aster and Basil tie.
    await queryInterface.bulkInsert('session_players', [
      {
        session_id: session.session_id,
        user_id: userByEmail['aster@campus.test'],
        nickname: 'Aster',
        score: 100,
        current_stage: 'gate',
        time_penalty_sec: 0,
        token_expires_at: null,
      },
      {
        session_id: session.session_id,
        user_id: userByEmail['basil@campus.test'],
        nickname: 'Basil',
        score: 100,
        current_stage: 'gate',
        time_penalty_sec: 5,
        token_expires_at: null,
      },
      {
        session_id: session.session_id,
        user_id: userByEmail['cora@campus.test'],
        nickname: 'Cora',
        score: 80,
        current_stage: 'gate',
        time_penalty_sec: 10,
        token_expires_at: null,
      },
      {
        session_id: session.session_id,
        user_id: userByEmail['dune@campus.test'],
        nickname: 'Dune',
        score: 40,
        current_stage: 'ict',
        time_penalty_sec: 20,
        token_expires_at: null,
      },
    ]);

    const players = await select(
      `SELECT player_id, nickname FROM session_players
       WHERE session_id = :sessionId`,
      { sessionId: session.session_id }
    );
    const playerByNickname = Object.fromEntries(
      players.map((player) => [player.nickname, player.player_id])
    );

    await queryInterface.bulkInsert('answers', [
      {
        player_id: playerByNickname.Aster,
        question_id: question.question_id,
        choice_index: 0,
        is_correct: true,
        answered_at: startedAt,
      },
      {
        player_id: playerByNickname.Basil,
        question_id: question.question_id,
        choice_index: 1,
        is_correct: false,
        answered_at: startedAt,
      },
      {
        player_id: playerByNickname.Cora,
        question_id: question.question_id,
        choice_index: 0,
        is_correct: true,
        answered_at: startedAt,
      },
      {
        player_id: playerByNickname.Dune,
        question_id: question.question_id,
        choice_index: 2,
        is_correct: false,
        answered_at: startedAt,
      },
    ]);

    // Awkward case: a room-swap reward affecting another player.
    await queryInterface.bulkInsert('reward_claims', [{
      player_id: playerByNickname.Aster,
      target_player_id: playerByNickname.Dune,
      stage: 'computer_lab',
      box_index: 1,
      points_awarded: 0,
      claimed_at: endedAt,
    }]);
  },

  async down(queryInterface) {
    const replacements = {
      joinCode: JOIN_CODE,
      setTitle: SET_TITLE,
      hostEmail: HOST_EMAIL,
    };

    await queryInterface.sequelize.query(`
      DELETE FROM "reward_claims"
      WHERE "player_id" IN (
        SELECT "player_id" FROM "session_players"
        WHERE "session_id" = (
          SELECT "session_id" FROM "sessions" WHERE "join_code" = :joinCode
        )
      )
      OR "target_player_id" IN (
        SELECT "player_id" FROM "session_players"
        WHERE "session_id" = (
          SELECT "session_id" FROM "sessions" WHERE "join_code" = :joinCode
        )
      )
    `, { replacements });

    await queryInterface.sequelize.query(`
      DELETE FROM "answers"
      WHERE "player_id" IN (
        SELECT "player_id" FROM "session_players"
        WHERE "session_id" = (
          SELECT "session_id" FROM "sessions" WHERE "join_code" = :joinCode
        )
      )
    `, { replacements });

    await queryInterface.sequelize.query(`
      DELETE FROM "session_players"
      WHERE "session_id" = (
        SELECT "session_id" FROM "sessions" WHERE "join_code" = :joinCode
      )
    `, { replacements });

    await queryInterface.bulkDelete('sessions', { join_code: JOIN_CODE }, {});

    await queryInterface.sequelize.query(`
      DELETE FROM "question_choices"
      WHERE "question_id" IN (
        SELECT q."question_id"
        FROM "questions" q
        JOIN "question_sets" qs ON qs."question_set_id" = q."question_set_id"
        JOIN "users" u ON u."user_id" = qs."user_id"
        WHERE qs."title" = :setTitle AND u."email" = :hostEmail
      )
    `, { replacements });

    await queryInterface.sequelize.query(`
      DELETE FROM "questions"
      WHERE "question_set_id" IN (
        SELECT qs."question_set_id"
        FROM "question_sets" qs
        JOIN "users" u ON u."user_id" = qs."user_id"
        WHERE qs."title" = :setTitle AND u."email" = :hostEmail
      )
    `, { replacements });

    await queryInterface.sequelize.query(`
      DELETE FROM "question_sets"
      WHERE "title" = :setTitle
        AND "user_id" = (SELECT "user_id" FROM "users" WHERE "email" = :hostEmail)
    `, { replacements });
  },
};