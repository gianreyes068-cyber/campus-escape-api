'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
      session_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      question_set_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'question_sets', key: 'question_set_id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      join_code: { type: Sequelize.STRING(6), allowNull: false, unique: true },
      status: { type: Sequelize.STRING(10), allowNull: false, defaultValue: 'waiting' },
      duration_sec: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 360 },
      started_at: { type: Sequelize.DATE, allowNull: true },
      ended_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addConstraint('sessions', {
      type: 'check', name: 'ck_sessions_join_code', fields: ['join_code'],
      where: Sequelize.where(Sequelize.col('join_code'), { [Sequelize.Op.regexp]: '^[1-9][0-9]{5}$' }),
    });
    await queryInterface.addConstraint('sessions', {
      type: 'check', name: 'ck_sessions_status', fields: ['status'],
      where: { status: { [Sequelize.Op.in]: ['waiting', 'playing', 'ended'] } },
    });
    await queryInterface.addConstraint('sessions', {
      type: 'check', name: 'ck_sessions_duration', fields: ['duration_sec'],
      where: { duration_sec: { [Sequelize.Op.gt]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sessions');
  },
};
