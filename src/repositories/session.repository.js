const { Session } = require('../models');

function findById(id) {
  return Session.findByPk(id);
}

function findByCode(joinCode) {
  return Session.findOne({
    where: { join_code: joinCode },
  });
}

function create(data) {
  return Session.create(data);
}

function update(session, changes) {
  return session.update(changes);
}

module.exports = { findById, findByCode, create, update };