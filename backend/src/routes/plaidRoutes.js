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
 * @access Private (requires authentication token)
 */
router.get('/create_link_token', authenticateToken, plaidController.createLinkToken)

/**
 * Exchange public token route.
 *
 * This route handles the exchange of a public token for an access token and item ID.
 * The `plaidController.exchangePublicToken` function processes the token exchange.
 *
 * @route POST /api/plaid/exchange_public_token
 * @access Private (requires authentication token)
 */
router.post('/exchange_public_token', authenticateToken, plaidController.exchangePublicToken)

/**
 * Link accounts route.
 *
 * This route handles linking Plaid accounts with the application by storing in the DB.
 * The `plaidController.linkAccounts` function processes the account linking.
 *
 * @route POST /api/plaid/link_accounts
 * @access Private (requires authentication token)
 */
router.post('/link_accounts', authenticateToken, plaidController.linkAccounts)


/**
 * Get accounts route.
 *
 * Retrieves linked Plaid accounts for the authenticated user.
 *
 * @route GET /api/plaid/get_accounts
 * @access Private (requires authentication token)
 */
router.get('/get_accounts', authenticateToken, plaidController.getAccounts)

/**
 * Get balance route.
 *
 * This route handles retrieving account balances from Plaid.
 * The `plaidController.getBalance` function processes the balance retrieval.
 *
 * @access Private (requires authentication token)
 */
router.post('/get_balance', authenticateToken, plaidController.getBalance)

module.exports = router
