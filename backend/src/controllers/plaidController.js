const plaidService = require('../services/plaidService')

/**
 * Create link token controller.
 *
 * Handles the creation of a link token for Plaid Link integration.
 * It uses the `plaidService.createLinkToken` service function.
 *
 * @param {Object} req - Express request object, containing the user ID.
 * @param {Object} res - Express response object.
 */
exports.createLinkToken = async (req, res) => {
    try {
        const tokenResponse = await plaidService.createLinkToken(req.user.id)
        res.json(tokenResponse)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

/**
 * Exchange public token controller.
 *
 * Handles the exchange of a public token for an access token and item ID.
 * Uses the `plaidService.exchangePublicToken` service function.
 *
 * @param {Object} req - Express request object, containing the user ID and public token.
 * @param {Object} res - Express response object.
 */
exports.exchangePublicToken = async (req, res) => {
    try {
        const accessToken = await plaidService.exchangePublicToken(req.user.id, req.body.public_token)
        res.json(accessToken)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

/**
 * Link accounts controller.
 *
 * Handles linking accounts with Plaid.
 * Uses the `plaidService.linkAccounts` service function.
 *
 * @param {Object} req - Express request object, containing the user ID.
 * @param {Object} res - Express response object.
 */
exports.linkAccounts = async (req, res) => {
    try {
        const accounts = await plaidService.linkAccounts(req.user.id)
        res.json(accounts)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

/**
 * Get accounts controller.
 *
 * Handles retrieving linked accounts from Plaid.
 * Uses the `plaidService.getAccounts` service function.
 *
 * @param {Object} req - Express request object, containing the user ID.
 * @param {Object} res - Express response object.
 */
exports.getAccounts = async (req, res, next) => {
    try {
        const accounts = await plaidService.getAccounts(req.user.id)
        res.json(accounts)
    }
    catch (error) {
        res.status(500).json(error.message)
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
 */
exports.getBalance = async (req, res) => {
    try {
        const balance = await plaidService.getBalance(req.body.access_token)
        res.json({ Balance: balance })
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}
