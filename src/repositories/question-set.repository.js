const { QuestionSet } = require('../models');

const SORTABLE_COLUMNS = [
  'question_set_id',
  'title',
  'subject',
  'grade_level',
  'created_at',
];

function findAllByOwner(userId) {
  return QuestionSet.findAll({
    where: { user_id: userId },
    order: [['question_set_id', 'ASC']],
  });
}

function findAndCountByOwner(
  userId,
  { limit, offset, sort = 'question_set_id', order = 'asc' }
) {
  // Keep sorting restricted to known database columns.
  const sortColumn = SORTABLE_COLUMNS.includes(sort) ? sort : 'question_set_id';
  const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

  const orderBy = [[sortColumn, sortOrder]];

  // Add a stable tie-breaker when sorting by another column.
  if (sortColumn !== 'question_set_id') {
    orderBy.push(['question_set_id', 'ASC']);
  }

  return QuestionSet.findAndCountAll({
    where: { user_id: userId },
    limit,
    offset,
    order: orderBy,
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

module.exports = {
  findAllByOwner,
  findAndCountByOwner,
  findById,
  create,
  update,
  remove,
};