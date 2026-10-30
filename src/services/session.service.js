const sessionRepository = require('../repositories/session.repository');
const questionSetService = require('./question-set.service');
const { notFound, conflict } = require('../errors/app-error');
const { constraintOf } = require('../errors/db-errors');

const NEXT_STATUS = {
  waiting: ['playing', 'ended'],
  playing: ['ended'],
  ended: [],
};

function randomJoinCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function findOrFailByCode(joinCode) {
  const session = await sessionRepository.findByCode(joinCode);

  if (!session) {
    throw notFound(
      'SESSION_NOT_FOUND',
      `No session has the join code ${joinCode}.`
    );
  }

  return session;
}

async function create(questionSetId, user) {
  // This also checks that the question set exists and belongs to this host.
  const questionSet = await questionSetService.get(questionSetId, user);

  // Retry only if the randomly generated join code is already taken.
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await sessionRepository.create({
        question_set_id: questionSet.question_set_id,
        join_code: randomJoinCode(),
      });
    } catch (error) {
      const constraint = constraintOf(error);

      if (!constraint || !constraint.includes('join_code')) {
        throw error;
      }
    }
  }

  throw conflict(
    'JOIN_CODE_GENERATION_FAILED',
    'Could not generate a unique join code. Please try again.'
  );
}

async function getByCode(joinCode) {
  return findOrFailByCode(joinCode);
}

async function changeStatus(joinCode, status, user) {
  const session = await findOrFailByCode(joinCode);

  // The session has no host_user_id column, so ownership is checked
  // through the question set that this session uses.
  await questionSetService.get(session.question_set_id, user);

  const allowedStatuses = NEXT_STATUS[session.status] || [];

  if (!allowedStatuses.includes(status)) {
    throw conflict(
      'INVALID_STATUS_CHANGE',
      `A ${session.status} session cannot change to ${status}.`
    );
  }

  const changes = { status };

  if (status === 'playing') {
    changes.started_at = new Date();
  }

  if (status === 'ended') {
    changes.ended_at = new Date();
  }

  return sessionRepository.update(session, changes);
}

module.exports = { create, getByCode, changeStatus };