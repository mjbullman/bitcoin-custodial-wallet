const bitcoinService = require('../services/bitcoinService')

/**
 * Purchase Bitcoin Controller
 *
 * Handles the purchase of Bitcoin for a user by calling bitcoinService.purchaseBTC.
 * Sends back the purchase response as JSON upon successful transaction.
 *
 * @param {Object} req - Express request object containing user ID in req.user.id, account ID, BTC amount, and amount in req.body.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.purchaseBTC = async (req, res) => {
    try {
        const response = await bitcoinService.purchaseBTC(req.user.id, req.body.account_id, req.body.btc_amount, req.body.amount)
        res.json(response)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}

/**
 * Get Bitcoin Balance Controller
 *
 * Retrieves the Bitcoin balance for a user by calling bitcoinService.getBTCBalance.
 * Sends back the balance response as JSON upon successful retrieval.
 *
 * @param {Object} req - Express request object containing user ID in req.user.id.
 * @param {Object} res - Express response object to send HTTP response.
 */
exports.getBTCBalance = async (req, res) => {
    try {
        const response = await bitcoinService.getBTCBalance(req.user.id)
        res.json(response)
    }
    catch (error) {
        res.status(500).json(error.message)
    }
}
