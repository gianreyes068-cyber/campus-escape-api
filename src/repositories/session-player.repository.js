const { SessionPlayer } = require('../models');

function findSeat(sessionId, userId) {
  return SessionPlayer.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

function create(data) {
  return SessionPlayer.create(data);
}

module.exports = { findSeat, create };