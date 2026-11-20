const { body } = require('express-validator');

const registerRules = [
  body('school_id')
    .exists()
    .withMessage('school_id is required.')
    .bail()
    .isString()
    .withMessage('school_id must be text.')
    .bail()
    .trim()
    .matches(/^\d{4}-\d{4}$/)
    .withMessage('school_id must contain four digits, a hyphen, then four digits.'),

  body('full_name')
    .exists()
    .withMessage('full_name is required.')
    .bail()
    .isString()
    .withMessage('full_name must be text.')
    .bail()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('full_name must be 2 to 80 characters long.'),

  body('email')
    .exists()
    .withMessage('email is required.')
    .bail()
    .isEmail()
    .withMessage('email must be a valid email address.')
    .bail()
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('email must be no more than 254 characters.'),

  body('password')
    .exists()
    .withMessage('password is required.')
    .bail()
    .isString()
    .withMessage('password must be text.')
    .bail()
    .isLength({ min: 8, max: 72 })
    .withMessage('password must be 8 to 72 characters long.')
    .bail()
    .matches(/(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('password must contain at least one letter and one number.'),
];

const loginRules = [
  body('school_id')
    .exists()
    .withMessage('school_id is required.')
    .bail()
    .isString()
    .withMessage('school_id must be text.')
    .bail()
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('school_id must be 1 to 20 characters long.'),

  body('password')
    .exists()
    .withMessage('password is required.')
    .bail()
    .isString()
    .withMessage('password must be text.')
    .bail()
    .notEmpty()
    .withMessage('password cannot be empty.'),
];

module.exports = { registerRules, loginRules };