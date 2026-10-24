'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      question_set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      question_type: {
        type: Sequelize.STRING(24),
        allowNull: false,
      },
      difficulty_level: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      time_limit_sec: {
        type: Sequelize.SMALLINT,
        allowNull: false,
        defaultValue: 20,
      },
      correct_index: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_question_type"
      CHECK ("question_type" IN ('multiple_choice', 'true_false'))
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_difficulty_level"
      CHECK ("difficulty_level" BETWEEN 1 AND 4)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_time_limit_sec"
      CHECK ("time_limit_sec" BETWEEN 5 AND 60)
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "questions"
      ADD CONSTRAINT "ck_questions_correct_index_nonnegative"
      CHECK ("correct_index" >= 0)
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};