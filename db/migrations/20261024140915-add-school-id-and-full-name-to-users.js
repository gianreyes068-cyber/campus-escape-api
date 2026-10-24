'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'school_id', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'full_name', {
      type: Sequelize.STRING(80),
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "school_id" = '2099' || LPAD("user_id"::text, 8, '0'),
          "full_name" = 'Demo User ' || "user_id"::text
      WHERE "school_id" IS NULL OR "full_name" IS NULL
    `);

    await queryInterface.changeColumn('users', 'school_id', {
      type: Sequelize.STRING(20),
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'full_name', {
      type: Sequelize.STRING(80),
      allowNull: false,
    });

    await queryInterface.addConstraint('users', {
      type: 'unique',
      name: 'uq_users_school_id',
      fields: ['school_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('users', 'uq_users_school_id');
    await queryInterface.removeColumn('users', 'full_name');
    await queryInterface.removeColumn('users', 'school_id');
  },
};