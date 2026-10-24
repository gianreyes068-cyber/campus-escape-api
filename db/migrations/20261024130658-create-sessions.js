'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      session_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'question_sets',
          key: 'question_set_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      join_code: {
        type: Sequelize.STRING(6),
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.STRING(16),
        allowNull: false,
        defaultValue: 'waiting',
      },
      duration_sec: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 360,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "sessions"
      ADD CONSTRAINT "ck_sessions_join_code_format"
      CHECK ("join_code" ~ '^[1-9][0-9]{4,5}$')
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "sessions"
      ADD CONSTRAINT "ck_sessions_status"
      CHECK ("status" IN ('waiting', 'playing', 'ended'))
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};