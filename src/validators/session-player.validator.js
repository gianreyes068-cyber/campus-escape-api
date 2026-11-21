const { body, param } = require('express-validator');

function codeParam() {
  return param('code')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('code must be a six-digit number.');
}

const joinRules = [
  codeParam(),
  body('nickname')
    .exists()
    .withMessage('nickname is required.')
    .bail()
    .isString()
    .withMessage('nickname must be text.')
    .bail()
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('nickname must be 2 to 20 characters long.'),
];

const answerRules = [
  codeParam(),
  body('question_id')
    .exists()
    .withMessage('question_id is required.')
    .bail()
    .isInt({ min: 1 })
    .withMessage('question_id must be a positive whole number.')
    .toInt(),
  body('choice_index')
    .exists()
    .withMessage('choice_index is required.')
    .bail()
    .isInt({ min: 0 })
    .withMessage('choice_index must be zero or a positive whole number.')
    .toInt(),
];

module.exports = { joinRules, answerRules };