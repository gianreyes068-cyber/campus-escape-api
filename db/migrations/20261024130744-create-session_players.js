'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_players', {
      player_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sessions', key: 'session_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      nickname: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      current_stage: {
        type: Sequelize.STRING(24),
        allowNull: false,
        defaultValue: 'campus',
      },
      time_penalty_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      token_expires_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint('session_players', {
      type: 'unique',
      name: 'uq_session_players_session_user',
      fields: ['session_id', 'user_id'],
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "session_players"
      ADD CONSTRAINT "ck_session_players_nickname_length"
      CHECK (char_length("nickname") BETWEEN 2 AND 20)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "session_players"
      ADD CONSTRAINT "ck_session_players_score_nonnegative"
      CHECK ("score" >= 0)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "session_players"
      ADD CONSTRAINT "ck_session_players_time_penalty_nonnegative"
      CHECK ("time_penalty_sec" >= 0)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "session_players"
      ADD CONSTRAINT "ck_session_players_current_stage"
      CHECK ("current_stage" IN ('campus', 'computer_lab', 'ccb', 'ict', 'gate'))
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('session_players');
  },
};