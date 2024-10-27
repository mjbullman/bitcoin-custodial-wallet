const express = require('express')
const router = express.Router()

const authenticateToken = require('../middlewares/auth/authToken')
const bitcoinController = require('../controllers/bitcoinController')

/**
 * Bitcoin balance route.
 *
 * This route retrieves the current Bitcoin balance associated with the user's Bitcoin wallet address.
 * The `bitcoinController.getBTCBalance` function processes the balance retrieval.
 *
 * @route GET /api/bitcoin/balance
 * @access Private (requires authentication token)
 */
router.get('/balance', authenticateToken, bitcoinController.getBTCBalance)

/**
 * Bitcoin purchase route.
 *
 * This route handles the purchase of Bitcoin using the user's Plaid account.
 * The `bitcoinController.purchaseBTC` function processes the Bitcoin purchase.
 *
 * @route POST /api/bitcoin/purchase
 * @access Private (requires authentication token)
 */
router.post('/purchase', authenticateToken, bitcoinController.purchaseBTC)

module.exports = router
