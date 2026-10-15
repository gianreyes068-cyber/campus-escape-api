'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reward_claims', {
      reward_claim_id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false },
      seat_id: {
        type: Sequelize.BIGINT, allowNull: false,
        references: { model: 'seats', key: 'seat_id' }, onUpdate: 'CASCADE', onDelete: 'CASCADE',
      },
      target_seat_id: {
        type: Sequelize.BIGINT, allowNull: true,
        references: { model: 'seats', key: 'seat_id' }, onUpdate: 'CASCADE', onDelete: 'SET NULL',
      },
      stage: { type: Sequelize.STRING(20), allowNull: false },
      box_index: { type: Sequelize.SMALLINT, allowNull: false },
      points_awarded: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      claimed_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
    });
    await queryInterface.addConstraint('reward_claims', {
      type: 'check', name: 'ck_reward_claims_stage', fields: ['stage'],
      where: { stage: { [Sequelize.Op.in]: ['computer_lab', 'ccb', 'ict'] } },
    });
    await queryInterface.addConstraint('reward_claims', {
      type: 'check', name: 'ck_reward_claims_box_index', fields: ['box_index'],
      where: { box_index: { [Sequelize.Op.between]: [1, 3] } },
    });
    await queryInterface.addConstraint('reward_claims', {
      type: 'check', name: 'ck_reward_claims_points', fields: ['points_awarded'],
      where: { points_awarded: { [Sequelize.Op.gte]: 0 } },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reward_claims');
  },
};
