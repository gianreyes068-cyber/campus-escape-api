const { matchedData } = require('express-validator');
const service = require('../services/session.service');

function toJson(session) {
  return {
    session_id: session.session_id,
    question_set_id: session.question_set_id,
    join_code: session.join_code,
    status: session.status,
    duration_sec: session.duration_sec,
    started_at: session.started_at,
    ended_at: session.ended_at,
  };
}

async function create(req, res) {
  const { question_set_id: questionSetId } = matchedData(req, {
    locations: ['body'],
  });

  const session = await service.create(questionSetId, req.user);
  res.status(201).json(toJson(session));
}

async function get(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const session = await service.getByCode(code);

  res.status(200).json(toJson(session));
}

async function changeStatus(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { status } = matchedData(req, { locations: ['body'] });

  const session = await service.changeStatus(code, status, req.user);
  res.status(200).json(toJson(session));
}

module.exports = { create, get, changeStatus };