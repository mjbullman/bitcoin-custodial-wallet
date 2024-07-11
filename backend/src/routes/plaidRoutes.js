const express = require('express')
const router = express.Router()
const plaidController = require('../controllers/plaidController')
const authenticateToken = require('../middlewares/auth/authToken')

/**
 * Create link token route.
 *
 * This route handles the creation of a link token for Plaid Link integration.
 * The `plaidController.createLinkToken` function processes the link token creation.
 *
 * @route GET /api/plaid/create_link_token
 */
router.get('/create_link_token', authenticateToken, plaidController.createLinkToken)

/**
 * Exchange public token route.
 *
 * This route handles the exchange of a public token for an access token and item ID.
 * The `plaidController.exchangePublicToken` function processes the token exchange.
 *
 * @route POST /api/plaid/exchange_public_token
 */
router.post('/exchange_public_token', authenticateToken, plaidController.exchangePublicToken)

/**
 * Link accounts route.
 *
 * This route handles linking Plaid accounts with the application by storing in the DB.
 * The `plaidController.linkAccounts` function processes the account linking.
 *
 * @route POST /api/plaid/link_accounts
 */
router.post('/link_accounts', authenticateToken, plaidController.linkAccounts)

/**
 * Get balance route.
 *
 * This route handles retrieving account balances from Plaid.
 * The `plaidController.getBalance` function processes the balance retrieval.
 *
 * @route POST /api/plaid/get_balance
 */
router.post('/get_balance', authenticateToken, plaidController.getBalance)

module.exports = router
