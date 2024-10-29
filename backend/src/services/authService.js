const jwt = require('jsonwebtoken')
const User = require('../models/User')

const { generateToken } = require('../utils/jwtAuth')
const { generateBitcoinAddress } = require('./bitcoinService')

/**
 * Handles the user signup process.
 *
 * Creates a new user in the database and generates a JWT token for authentication.
 * Also create a Bitcoin wallet address for the user.
 *
 * @param {Object} userDetails - An object containing user details (name, email, password).
 * @returns {Object} - An object containing the created user and the generated JWT token.
 * @throws {Error} - Throws an error if the user creation fails.
 */
async function signup(userDetails) {
    const { name, email, password } = userDetails
    let btc_wallet_address = ''

    try {
        [btc_wallet_address] = await Promise.all([generateBitcoinAddress()]);
    }
    catch (error) {
        console.error(error)
    }

    const user = await User.create({ name, email, password, btc_wallet_address })
    const token = generateToken(user)

    return { user, token }
}

/**
 * Handles the user login process.
 *
 * Verifies user credentials and generates a JWT token for authenticated sessions.
 *
 * @param {Object} loginDetails - An object containing login details (email, password).
 * @returns {Object} - An object containing the authenticated user and the generated JWT token.
 * @throws {Error} - Throws an error if the email or password is incorrect.
 */
async function login(loginDetails) {
    const { email, password } = loginDetails
    const user = await User.findOne({ where: { email } })

    if (user && user.verifyPassword(password)) {
        const token = generateToken(user)
        return { user, token }
    }
    else {
        throw new Error('Email or password incorrect!')
    }
}

/**
 * Verifies the JWT token and returns decoded user information.
 *
 * @param {string} token - The JWT token to be verified.
 * @returns {Object} - The decoded user information if the token is valid.
 * @throws {Error} - Throws an error if the token is invalid or not provided.
 */
function check(token) {
    if (!token) {
        throw new Error('No token provided.')
    }

    return jwt.verify(token, process.env.JWT_SECRET)
}

/**
 * Logs the user out by clearing the JWT token cookie.
 *
 * @param {Response} res - The response object used to clear the cookie.
 */
function logout(res) {
    res.clearCookie('token', { path: '/' })
}

module.exports = {
    login,
    check,
    signup,
    logout
}
