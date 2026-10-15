'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_choices', {
      question_id: {
        type: Sequelize.BIGINT, allowNull: false, primaryKey: true,
        references: { model: 'questions', key: 'question_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      choice_index: { type: Sequelize.SMALLINT, allowNull: false, primaryKey: true },
      choice_text: { type: Sequelize.STRING(120), allowNull: false },
    });
    await queryInterface.addConstraint('question_choices', {
      type: 'check', name: 'ck_question_choices_index', fields: ['choice_index'],
      where: { choice_index: { [Sequelize.Op.between]: [0, 3] } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('question_choices');
  },
};
