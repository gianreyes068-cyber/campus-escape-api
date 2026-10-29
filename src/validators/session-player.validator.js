const { body, param } = require('express-validator');

const joinRules = [
  param('code')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('code must be a six-digit number.'),

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

module.exports = { joinRules };