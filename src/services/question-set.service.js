const repository = require('../repositories/question-set.repository');
const { notFound, forbidden } = require('../errors/app-error');

async function findOrFail(id) {
  const questionSet = await repository.findById(id);

  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', `No question set has the id ${id}.`);
  }

  return questionSet;
}

function assertOwner(questionSet, user) {
  if (Number(questionSet.user_id) !== Number(user.user_id)) {
    throw forbidden('This question set belongs to another host.');
  }
}

function list(user) {
  return repository.findAllByOwner(user.user_id);
}

async function get(id, user) {
  const questionSet = await findOrFail(id);
  assertOwner(questionSet, user);
  return questionSet;
}

function create(data, user) {
  // The client cannot choose the owner; the server uses the caller's user_id.
  return repository.create({ ...data, user_id: user.user_id });
}

async function update(id, changes, user) {
  const questionSet = await findOrFail(id);
  assertOwner(questionSet, user);
  return repository.update(questionSet, changes);
}

async function remove(id, user) {
  const questionSet = await findOrFail(id);
  assertOwner(questionSet, user);
  await repository.remove(questionSet);
}

module.exports = { list, get, create, update, remove };