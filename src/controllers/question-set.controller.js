const { matchedData } = require('express-validator');
const service = require('../services/question-set.service');

function toJson(questionSet) {
  return {
    question_set_id: questionSet.question_set_id,
    title: questionSet.title,
    description: questionSet.description,
    subject: questionSet.subject,
    grade_level: questionSet.grade_level,
    created_at: questionSet.created_at,
  };
}

async function list(req, res) {
  const questionSets = await service.list(req.user);
  res.status(200).json(questionSets.map(toJson));
}

async function get(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const questionSet = await service.get(id, req.user);
  res.status(200).json(toJson(questionSet));
}

async function create(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const questionSet = await service.create(data, req.user);
  res.status(201).json(toJson(questionSet));
}

async function update(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  const changes = matchedData(req, { locations: ['body'] });
  const questionSet = await service.update(id, changes, req.user);
  res.status(200).json(toJson(questionSet));
}

async function remove(req, res) {
  const { id } = matchedData(req, { locations: ['params'] });
  await service.remove(id, req.user);
  res.status(204).end();
}

module.exports = { list, get, create, update, remove };