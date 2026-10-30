const { body, param } = require('express-validator');

function codeParam() {
  return param('code')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('code must be a six-digit number.');
}

const createRules = [
  body('question_set_id')
    .exists()
    .withMessage('question_set_id is required.')
    .bail()
    .isInt({ min: 1 })
    .withMessage('question_set_id must be a positive whole number.')
    .bail()
    .toInt(),
];

const statusRules = [
  codeParam(),
  body('status')
    .exists()
    .withMessage('status is required.')
    .bail()
    .isIn(['playing', 'ended'])
    .withMessage('status must be playing or ended.'),
];

module.exports = { codeParam, createRules, statusRules };