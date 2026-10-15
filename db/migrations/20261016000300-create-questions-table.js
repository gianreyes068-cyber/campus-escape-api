'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions', {
      question_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      question_set_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      question_text: { type: Sequelize.TEXT, allowNull: false },
      question_type: { type: Sequelize.STRING(20), allowNull: false },
      difficulty_level: { type: Sequelize.SMALLINT, allowNull: false },
      time_limit_sec: { type: Sequelize.SMALLINT, allowNull: false, defaultValue: 20 },
      correct_index: { type: Sequelize.SMALLINT, allowNull: false },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check', name: 'ck_questions_type', fields: ['question_type'],
      where: { question_type: { [Sequelize.Op.in]: ['multiple_choice', 'true_false'] } },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check', name: 'ck_questions_difficulty', fields: ['difficulty_level'],
      where: { difficulty_level: { [Sequelize.Op.between]: [1, 4] } },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check', name: 'ck_questions_time_limit', fields: ['time_limit_sec'],
      where: { time_limit_sec: { [Sequelize.Op.between]: [5, 60] } },
    });
    await queryInterface.addConstraint('questions', {
      type: 'check', name: 'ck_questions_correct_index', fields: ['correct_index'],
      where: { correct_index: { [Sequelize.Op.between]: [0, 3] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('questions');
  },
};
