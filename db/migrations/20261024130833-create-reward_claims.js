'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reward_claims', {
      reward_claim_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      player_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'session_players', key: 'player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      target_player_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'session_players', key: 'player_id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      stage: {
        type: Sequelize.STRING(24),
        allowNull: false,
      },
      box_index: {
        type: Sequelize.SMALLINT,
        allowNull: false,
      },
      points_awarded: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      claimed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.sequelize.query(`
      ALTER TABLE "reward_claims"
      ADD CONSTRAINT "ck_reward_claims_stage"
      CHECK ("stage" IN ('campus', 'computer_lab', 'ccb', 'ict', 'gate'))
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "reward_claims"
      ADD CONSTRAINT "ck_reward_claims_points_awarded_nonnegative"
      CHECK ("points_awarded" >= 0)
    `);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reward_claims');
  },
};