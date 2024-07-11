const jwt = require('jsonwebtoken')
const cookie = require('cookie')

/**
 * Generates a JWT token for the given user.
 *
 * @param {Object} user - The user object containing user details.
 * @param {string} user.id - The ID of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.name - The name of the user.
 * @returns {string} The generated JWT token.
 */
const generateToken = (user) => {
    return jwt.sign({
        id: user.id, email: user.email, name: user.name, address: user.address, btc_wallet_address: user.btc_wallet_address
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES
    })
}

/**
 * Sets the JWT token as a cookie in the response.
 *
 * @param {Object} res - The HTTP response object.
 * @param {string} token - The JWT token to be set as a cookie.
 */
const setTokenCookie = (res, token) => {
    const serializedToken = cookie.serialize('token', token, {
        httpOnly: false,
        secure: false,
        maxAge: 60 * 60 * 1000,
        path: '/',
    })

    res.setHeader('Set-Cookie', serializedToken)
}

module.exports = { generateToken, setTokenCookie }
