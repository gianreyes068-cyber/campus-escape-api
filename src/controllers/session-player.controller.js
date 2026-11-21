const { matchedData } = require('express-validator');
const service = require('../services/session-player.service');

async function join(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { nickname } = matchedData(req, { locations: ['body'] });

  const { session, player, created } = await service.join(
    code,
    nickname,
    req.user
  );

  res.status(created ? 201 : 200).json({
    player_id: player.player_id,
    nickname: player.nickname,
    score: player.score,
    current_stage: player.current_stage,
    rejoined: !created,
    session: {
      join_code: session.join_code,
      status: session.status,
    },
  });
}

async function answer(req, res) {
  const { code } = matchedData(req, { locations: ['params'] });
  const { question_id: questionId, choice_index: choiceIndex } = matchedData(
    req,
    { locations: ['body'] }
  );

  const result = await service.answer(
    code,
    questionId,
    choiceIndex,
    req.user
  );

  res.status(201).json(result);
}

module.exports = { join, answer };