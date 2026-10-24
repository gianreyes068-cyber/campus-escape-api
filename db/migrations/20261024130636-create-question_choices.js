'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_choices', {
      question_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'questions', key: 'question_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      choice_index: {
        type: Sequelize.SMALLINT,
        primaryKey: true,
        allowNull: false,
      },
      choice_text: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "question_choices"
      ADD CONSTRAINT "ck_question_choices_choice_index_nonnegative"
      CHECK ("choice_index" >= 0)
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('question_choices');
  },
};