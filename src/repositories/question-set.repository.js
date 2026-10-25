const { QuestionSet } = require('../models');

function findAllByOwner(userId) {
  return QuestionSet.findAll({
    where: { user_id: userId },
    order: [['question_set_id', 'ASC']],
  });
}

function findById(id) {
  return QuestionSet.findByPk(id);
}

function create(data) {
  return QuestionSet.create(data);
}

function update(questionSet, changes) {
  return questionSet.update(changes);
}

function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = { findAllByOwner, findById, create, update, remove };