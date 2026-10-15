'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_sets', {
      question_set_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      user_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'users', key: 'user_id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      title: { type: Sequelize.STRING(80), allowNull: false },
      description: { type: Sequelize.STRING(500), allowNull: true },
      subject: { type: Sequelize.STRING(120), allowNull: false },
      grade_level: { type: Sequelize.STRING(40), allowNull: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addConstraint('question_sets', {
      type: 'check', name: 'ck_question_sets_title_length', fields: ['title'],
      where: Sequelize.where(Sequelize.fn('char_length', Sequelize.col('title')), { [Sequelize.Op.between]: [3, 80] }),
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('question_sets');
  },
};
