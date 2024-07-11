const jwt = require('jsonwebtoken')

/**
 * Middleware to authenticate JWT token from request cookies.
 *
 * Verifies the JWT token from request cookies against the JWT_SECRET environment variable.
 * If the token is valid, attaches the decoded user information to req.user and calls next().
 * If the token is missing or invalid, sends appropriate HTTP responses (401 for Unauthorized, 403 for Forbidden).
 *
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} next - The next middleware function in the chain.
 */
const authenticateToken = (req, res, next) => {
    const token = req.cookies['token']

    if (token == null) {
        return res.status(401).send({ message: 'Unauthorized' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({ message: 'Forbidden' })
        }

        req.user = user
        next()
    })
}

module.exports = authenticateToken
