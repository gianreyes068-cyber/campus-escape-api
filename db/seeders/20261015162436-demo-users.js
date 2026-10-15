'use strict';

const demoEmails = [
  'host@campusescape.test',
  'mia@campusescape.test',
  'noe@campusescape.test',
  'luz@campusescape.test',
  'unused@campusescape.test',
];

const demoFullNames = [
  'Game Host',
  'Mia',
  'Noe',
  'Luz',
  'Unused Demo User',
];

// Demo-only bcrypt hash for the word "password".
const demoPasswordHash =
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'users',
      demoEmails.map((email, index) => ({
        email,
        full_name: demoFullNames[index],
        role: index === 0 ? 'host' : 'player',
        password_hash: demoPasswordHash,
        created_at: now,
      }))
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      email: { [Sequelize.Op.in]: demoEmails },
    });
  },
};
