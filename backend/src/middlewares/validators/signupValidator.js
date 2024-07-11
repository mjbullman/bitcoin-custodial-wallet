const User = require('../../models/user')
const { check, validationResult } = require('express-validator')

/*
 * Sign up form validation middleware.
 *
 * This middleware checks the 'name', 'email', and 'password' fields
 * to ensure they meet the required validation criteria.
 */
exports.validateSignUpForm = [
    check('name')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('Name required!')
        .bail()
        .isLength({min: 3})
        .withMessage('Name minimum 3 characters required!')
        .bail(),
    check('email')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Email address required!')
        .bail()
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address!')
        .bail()
        .custom(async email => {
            const user = await User.findOne({where: { email: email}})

            if (user) {
                throw new Error('E-mail already in use')
            }
        }),
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
