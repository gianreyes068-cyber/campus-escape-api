'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // School IDs are fictional for this project and start with 2099.
    // They are derived from the database-generated user_id, so they are
    // present for existing and newly inserted users without typing PKs.
    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD COLUMN "school_id" VARCHAR(20)
      GENERATED ALWAYS AS ('2099' || LPAD("user_id"::text, 8, '0')) STORED
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "uq_users_school_id" UNIQUE ("school_id")
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "users" DROP COLUMN "school_id"'
    );
  },
};
