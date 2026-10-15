'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: 'Campus Escape User',
    });

    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: 'player',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'full_name');
  },
};
