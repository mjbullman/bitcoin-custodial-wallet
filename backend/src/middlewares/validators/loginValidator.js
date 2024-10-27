const { check, validationResult } = require('express-validator')

/*
 * Login form validation middleware.
 *
 * This middleware checks the 'email' and 'password' fields
 * to ensure they meet the required validation criteria.
 */
exports.validateLoginForm = [
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email address required!')
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address!')
        .bail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password required!')
        .bail(),
    (req, res, next) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()})
        }

        next()
    }
]
