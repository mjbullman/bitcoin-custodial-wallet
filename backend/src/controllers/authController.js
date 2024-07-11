const authService = require('../services/authService')
const { setTokenCookie } = require('../utils/jwtAuth')

/**
 * Signup Controller
 *
 * Handles user signup process by calling authService.signup.
 * Sets JWT token cookie upon successful signup.
 *
 * @param {Object} req - Express request object containing user data in req.body.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.signup = async (req, res) => {
    try {
        const { user, token } = await authService.signup(req.body)

        setTokenCookie(res, token)

        return res.status(201).json({ user: user })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Error creating user' })
    }
}

/**
 * Login Controller
 *
 * Handles user login process by calling authService.login.
 * Sets JWT token cookie upon successful login.
 *
 * @param {Object} req - Express request object containing user credentials in req.body.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.login = async (req, res) => {
    try {
        const { user, token } = await authService.login(req.body)

        setTokenCookie(res, token)

        return res.json({user: user})
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({errors: [{msg: 'Email or password incorrect!'}] })
    }
}

/**
 * Check Controller
 *
 * Checks if user session is valid by verifying JWT token from cookies.
 *
 * @param {Object} req - Express request object containing JWT token in cookies.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.check = async (req, res) => {
    try {
        const user = authService.check( req.cookies.token)

        return res.json({ user: user })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Invalid token' })
    }
}

/**
 * Logout Controller
 *
 * Logs out the user by clearing JWT token cookie.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.logout = async (req, res) => {
    authService.logout(res)
    return res.json({ message: 'Logged out successfully' })
}
