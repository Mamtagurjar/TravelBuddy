const { query, validationResult } = require('express-validator');

/**
 * Validation rules for the search endpoint.
 * All filters are optional — only `city` is loosely expected.
 */
const searchValidationRules = [
  query('city')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters'),

  query('check_in')
    .optional()
    .isISO8601()
    .withMessage('check_in must be a valid date (YYYY-MM-DD)'),

  query('check_out')
    .optional()
    .isISO8601()
    .withMessage('check_out must be a valid date (YYYY-MM-DD)'),

  query('adults')
    .optional()
    .isInt({ min: 1, max: 20 })
    .toInt()
    .withMessage('adults must be between 1 and 20'),

  query('star_rating')
    .optional()
    .isString()
    .withMessage('star_rating must be comma-separated integers (e.g., 3,4,5)'),

  query('amenities')
    .optional()
    .isString()
    .withMessage('amenities must be comma-separated values'),

  query('meal_plan')
    .optional()
    .isString()
    .withMessage('meal_plan must be comma-separated values'),

  query('bed_type')
    .optional()
    .isString()
    .withMessage('bed_type must be comma-separated values'),

  query('property_type')
    .optional()
    .isString()
    .withMessage('property_type must be comma-separated values'),

  query('free_cancellation')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('free_cancellation must be true or false'),

  query('no_credit_card')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('no_credit_card must be true or false'),

  query('min_price')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('min_price must be a positive number'),

  query('max_price')
    .optional()
    .isFloat({ min: 0 })
    .toFloat()
    .withMessage('max_price must be a positive number'),

  query('sort_by')
    .optional()
    .isIn(['price_asc', 'price_desc', 'rating_desc', 'rating_asc', 'name_asc', 'name_desc', 'price_low', 'price_high', 'rating', 'popularity'])
    .withMessage('sort_by must be one of the allowed sort types'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .toInt()
    .withMessage('limit must be between 1 and 100'),
];

/**
 * Middleware to check validation results and return errors if any.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
        value: e.value,
      })),
    });
  }
  next();
};

module.exports = { searchValidationRules, handleValidationErrors };
