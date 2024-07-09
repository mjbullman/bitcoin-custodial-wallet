const express = require('express')
const router = express.Router()

const authController = require('../controllers/authController')
const { validateLoginForm } = require('../middlewares/validators/loginValidator')
const { validateSignUpForm } = require('../middlewares/validators/signupValidator')

/**
 * User signup route.
 *
 * This route handles user registration.
 * The `validateSignUpForm` middleware is used to validate the incoming request body.
 * The `authController.signup` function processes the signup logic.
 *
 * @route POST /api/auth/signup
 */
router.route('/signup').post(validateSignUpForm, authController.signup)

/**
 * User login route.
 *
 * This route handles user authentication.
 * The `validateLoginForm` middleware is used to validate the incoming request body.
 * The `authController.login` function processes the login logic.
 *
 * @route POST /api/auth/login
 */
router.route('/login').post(validateLoginForm, authController.login)

/**
 * User logout route.
 *
 * This route handles user logout.
 * The `authController.logout` function processes the logout logic.
 *
 * @route GET /api/auth/logout
 */
router.route('/logout').get(authController.logout)

/**
 * User authentication check route.
 *
 * This route checks if a user is authenticated.
 * The `authController.check` function verifies the authentication status.
 *
 * @route GET /api/auth/check
 */
router.route('/check').get(authController.check)

module.exports = router