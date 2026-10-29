'use strict';

const SECOND_HOST = {
  email: 'host2@campus.test',
  school_id: '209900000006',
  full_name: 'Demo Host Two',
  role: 'host',
};

// Reuse the demo-only hash from your existing demo-users seeder.
const DEMO_PASSWORD_HASH =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        ...SECOND_HOST,
        password_hash: DEMO_PASSWORD_HASH,
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      { school_id: SECOND_HOST.school_id },
      {}
    );
  },
};