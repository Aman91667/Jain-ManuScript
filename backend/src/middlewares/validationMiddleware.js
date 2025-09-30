const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .escape(),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

const researcherSignupValidation = [
  ...signupValidation,
  body('phoneNumber')
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('researchDescription')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Research description must be between 20 and 2000 characters')
    .escape(),
];

const manuscriptValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description must be less than 5000 characters')
    .escape(),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .escape(),
  body('language')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .escape(),
  body('author')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .escape(),
  validate
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  validate
];

module.exports = { 
  signupValidation,
  researcherSignupValidation,
  manuscriptValidation,
  mongoIdValidation,
  validate 
};