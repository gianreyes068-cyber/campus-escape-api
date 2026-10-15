'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {
      seat_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      session_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'sessions', key: 'session_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'users', key: 'user_id' }, onUpdate: 'CASCADE', onDelete: 'RESTRICT',
      },
      nickname: { type: Sequelize.STRING(20), allowNull: false },
      score: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      current_stage: { type: Sequelize.STRING(20), allowNull: false, defaultValue: 'campus' },
      time_penalty_sec: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      token_expires_at: { type: Sequelize.DATE, allowNull: true },
    });
    await queryInterface.addConstraint('seats', {
      type: 'unique', name: 'uq_seats_session_user', fields: ['session_id', 'user_id'],
    });
    await queryInterface.addConstraint('seats', {
      type: 'unique', name: 'uq_seats_session_nickname', fields: ['session_id', 'nickname'],
    });
    await queryInterface.addConstraint('seats', {
      type: 'check', name: 'ck_seats_nickname_length', fields: ['nickname'],
      where: Sequelize.where(Sequelize.fn('char_length', Sequelize.col('nickname')), { [Sequelize.Op.between]: [2, 20] }),
    });
    await queryInterface.addConstraint('seats', {
      type: 'check', name: 'ck_seats_score', fields: ['score'],
      where: { score: { [Sequelize.Op.gte]: 0 } },
    });
    await queryInterface.addConstraint('seats', {
      type: 'check', name: 'ck_seats_current_stage', fields: ['current_stage'],
      where: { current_stage: { [Sequelize.Op.in]: ['campus', 'computer_lab', 'ccb', 'ict', 'gate'] } },
    });
    await queryInterface.addConstraint('seats', {
      type: 'check', name: 'ck_seats_time_penalty', fields: ['time_penalty_sec'],
      where: { time_penalty_sec: { [Sequelize.Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('seats');
  },
};
