const { matchedData } = require('express-validator');
const service = require('../services/auth.service');

async function register(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const result = await service.register(data);
  res.status(201).json(result);
}

async function login(req, res) {
  const data = matchedData(req, { locations: ['body'] });
  const result = await service.login(data);
  res.status(200).json(result);
}

function me(req, res) {
  res.status(200).json({
    user: service.toPublicUser(req.account),
  });
}

module.exports = { register, login, me };