'use strict';

const DEMO_EMAILS = [
  'host@campus.test',
  'aster@campus.test',
  'basil@campus.test',
  'cora@campus.test',
  'dune@campus.test',
];

// Demo-only bcrypt hash. Do not use for real accounts.
const DEMO_PASSWORD_HASH =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

module.exports = {
  async up(queryInterface) {
    const createdAt = new Date();

    await queryInterface.bulkInsert('users', [
      {
        email: DEMO_EMAILS[0],
        password_hash: DEMO_PASSWORD_HASH,
        role: 'host',
        created_at: createdAt,
      },
      ...DEMO_EMAILS.slice(1).map((email) => ({
        email,
        password_hash: DEMO_PASSWORD_HASH,
        role: 'player',
        created_at: createdAt,
      })),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      { email: { [Sequelize.Op.in]: DEMO_EMAILS } },
      {}
    );
  },
};