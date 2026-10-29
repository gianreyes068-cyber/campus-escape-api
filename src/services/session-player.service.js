const sessionService = require('./session.service');
const repository = require('../repositories/session-player.repository');
const { conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

async function join(joinCode, nickname, user) {
  const session = await sessionService.getByCode(joinCode);

  // A returning account keeps its original seat and nickname.
  const existingSeat = await repository.findSeat(
    session.session_id,
    user.user_id
  );

  if (existingSeat) {
    return { session, player: existingSeat, created: false };
  }

  // Only new players may join while the session is waiting.
  if (session.status !== 'waiting') {
    throw conflict(
      'SESSION_NOT_JOINABLE',
      'This session is not accepting new players.'
    );
  }

  try {
    const player = await repository.create({
      session_id: session.session_id,
      user_id: user.user_id,
      nickname,
    });

    return { session, player, created: true };
  } catch (error) {
    // If two join requests for the same account arrive together,
    // the database unique constraint prevents a duplicate seat.
    if (constraintOf(error) !== 'uq_session_players_session_user') {
      throw error;
    }

    const seatCreatedByOtherRequest = await repository.findSeat(
      session.session_id,
      user.user_id
    );

    if (!seatCreatedByOtherRequest) {
      throw error;
    }

    return {
      session,
      player: seatCreatedByOtherRequest,
      created: false,
    };
  }
}

module.exports = { join };