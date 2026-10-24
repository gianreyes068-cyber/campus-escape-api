'use strict';

const DEMO_USERS = [
  {
    email: 'host@campus.test',
    school_id: '209900000001',
    full_name: 'Demo Host',
    role: 'host',
  },
  {
    email: 'aster@campus.test',
    school_id: '209900000002',
    full_name: 'Demo Aster',
    role: 'player',
  },
  {
    email: 'basil@campus.test',
    school_id: '209900000003',
    full_name: 'Demo Basil',
    role: 'player',
  },
  {
    email: 'cora@campus.test',
    school_id: '209900000004',
    full_name: 'Demo Cora',
    role: 'player',
  },
  {
    email: 'dune@campus.test',
    school_id: '209900000005',
    full_name: 'Demo Dune',
    role: 'player',
  },
];

// Demo-only bcrypt hash. Do not use for real accounts.
const DEMO_PASSWORD_HASH =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

module.exports = {
  async up(queryInterface) {
    const createdAt = new Date();

    await queryInterface.bulkInsert(
      'users',
      DEMO_USERS.map((user) => ({
        ...user,
        password_hash: DEMO_PASSWORD_HASH,
        created_at: createdAt,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      'users',
      {
        email: {
          [Sequelize.Op.in]: DEMO_USERS.map((user) => user.email),
        },
      },
      {}
    );
  },
};