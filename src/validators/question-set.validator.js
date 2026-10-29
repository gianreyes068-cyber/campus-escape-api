const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 })
  .withMessage('id must be a positive whole number.')
  .toInt();

const title = () =>
  body('title')
    .exists()
    .withMessage('title is required.')
    .bail()
    .isString()
    .withMessage('title must be text.')
    .bail()
    .trim()
    .isLength({ min: 3, max: 80 })
    .withMessage('title must be 3 to 80 characters long.');

const description = () =>
  body('description')
    .optional({ values: 'null' })
    .isString()
    .withMessage('description must be text or null.');

const subject = () =>
  body('subject')
    .exists()
    .withMessage('subject is required.')
    .bail()
    .isString()
    .withMessage('subject must be text.')
    .bail()
    .trim()
    .isLength({ min: 1, max: 80 })
    .withMessage('subject must be 1 to 80 characters long.');

const gradeLevel = () =>
  body('grade_level')
    .exists()
    .withMessage('grade_level is required.')
    .bail()
    .isString()
    .withMessage('grade_level must be text.')
    .bail()
    .trim()
    .isLength({ min: 1, max: 40 })
    .withMessage('grade_level must be 1 to 40 characters long.');

const createRules = [title(), description(), subject(), gradeLevel()];

const updateRules = [
  idParam,
  title().optional(),
  description(),
  subject().optional(),
  gradeLevel().optional(),
  body().custom((value) => {
    const allowedFields = ['title', 'description', 'subject', 'grade_level'];
    const hasChange = allowedFields.some((field) =>
      Object.prototype.hasOwnProperty.call(value || {}, field)
    );

    if (!hasChange) {
      throw new Error('Send at least one field to update.');
    }

    return true;
  }),
];

module.exports = { idParam, createRules, updateRules };