const plaidService = require('../services/plaidService')

/**
 * Create link token controller.
 *
 * This function handles the creation of a link token for Plaid Link integration.
 * It uses the `plaidService.createLinkToken` service function.
 *
 * @param {Object} req - Express request object, containing the user ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.createLinkToken = async (req, res, next) => {
    try {
        const tokenResponse = await plaidService.createLinkToken(req.user.id)
        res.json(tokenResponse)
    }
    catch (error) {
        next(error)
    }
}

/**
 * Exchange public token controller.
 *
 * This function handles the exchange of a public token for an access token and item ID.
 * It uses the `plaidService.exchangePublicToken` service function.
 *
 * @param {Object} req - Express request object, containing the user ID and public token.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.exchangePublicToken = async (req, res, next) => {
    try {
        const accessToken = await plaidService.exchangePublicToken(req.user.id, req.body.public_token)
        res.json(accessToken)
    }
    catch (error) {
        next(error)
    }
}

/**
 * Link accounts controller.
 *
 * This function handles linking accounts with Plaid.
 * It uses the `plaidService.linkAccounts` service function.
 *
 * @param {Object} req - Express request object, containing the user ID.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.linkAccounts = async (req, res, next) => {
    try {
        const accounts = await plaidService.linkAccounts(req.user.id)
        res.json(accounts)
    }
    catch (error) {
        next(error)
    }
}

/**
 * Get balance controller.
 *
 * This function handles retrieving account balances from Plaid.
 * It uses the `plaidService.getBalance` service function.
 *
 * @param {Object} req - Express request object, containing the access token.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
exports.getBalance = async (req, res, next) => {
    try {
        const balance = await plaidService.getBalance(req.body.access_token)
        res.json({ Balance: balance })
    }
    catch (error) {
        next(error)
    }
}
