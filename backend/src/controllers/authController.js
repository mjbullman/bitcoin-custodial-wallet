const jwt = require('jsonwebtoken')
const User = require('../models/User')
const bitcoinService = require('../services/btc.service')
const { generateToken, setTokenCookie } = require('../utils/jwtAuth')

/**
 * Handles the user signup process.
 *
 * - Extracts user details from the request body.
 * - Generates a Bitcoin address for the new user.
 * - Creates a new user record in the database with the provided details and generated Bitcoin address.
 * - Generates a JWT token for the new user and sets it as an HTTP-only cookie.
 *
 * @param {Request} req - The request object containing the user details in the body (name, email, password).
 * @param {Response} res - The response object used to send back the appropriate HTTP response.
 */
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        await bitcoinService.generateBitcoinAddress(async (err, address) => {
            const user = await User.create({ name, email, password, bitcoinAddress: address })

            // generate JWT auth token and store it in a cookie.
            const token = generateToken(user)
            setTokenCookie(res, token)

            return res.status(201).json({ message: 'User created successfully.', user: user })
        })
    }
    catch (error) {
        return res.status(500).json({ error: 'Error creating user' })
    }
}

/**
 * Handles the user login process.
 *
 * - Extracts login credentials from the request body.
 * - Finds the user in the database using the provided email.
 * - Verifies the provided password against the stored hash.
 * - Generates a JWT token for the authenticated user and sets it as an HTTP-only cookie.
 * - Returns the user details in the response.
 *
 * @param {Request} req - The request object containing the login credentials in the body (email, password).
 * @param {Response} res - The response object used to send back the appropriate HTTP response.
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ where: {email: email }})

        if (user && user.verifyPassword(password)) {
            // get JWT auth token and store in cookie.
            const token = await generateToken(user)
            setTokenCookie(res, token)

            res.status(200).json({ message: 'Login successful', user: {
                id: user.id,
                name: user.name,
                email: user.email
            }})
        }
        else {
            res.status(401).json({errors: [{
                msg: 'Email or password incorrect!'
            }]})
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error logging in' })
    }
}

/**
 * Verifies the JWT token stored in the request cookies and returns the decoded user information.
 *
 * - Checks if a token is present in the cookies.
 * - Verifies the token using the JWT secret.
 * - Returns the decoded user information if the token is valid.
 *
 * @param {Request} req - The request object containing the cookies.
 * @param {Response} res - The response object used to send back the appropriate HTTP response.
 */
exports.check = async (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        res.json({ user: decoded })
    }
    catch (err) {
        console.log(err)
        res.status(401).json({ message: 'Invalid token' })
    }
}

/**
 * Logs the user out by clearing the JWT token cookie.
 *
 * - Clears the token cookie from the client's browser.
 * - Sends a success message indicating the user has been logged out.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object used to send back the appropriate HTTP response.
 */
exports.logout = async (req, res) => {
    res.clearCookie('token', { path: '/' })
    res.json({ message: 'Logged out successfully' })
}
