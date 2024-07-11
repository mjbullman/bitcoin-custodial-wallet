const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')

const User = require('../models/User')
const Account = require('../models/Account')

const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
            'PLAID-SECRET': process.env.PLAID_SECRET
        }
    }
})

const client = new PlaidApi(configuration)

/**
 * Create a link token for Plaid Link integration.
 *
 * This function generates a link token for a specific user, which is used for initializing Plaid Link.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Object} - The link token response data.
 */
const createLinkToken = async (userId) => {
    const tokenResponse = await client.linkTokenCreate({
        user: { client_user_id: userId.toString() },
        client_name: 'Exodus Custodial Wallet',
        language: 'en',
        products: ['auth'],
        country_codes: ['US'],
        redirect_uri: process.env.PLAID_REDIRECT_URI,
    })

    return tokenResponse.data
}

/**
 * Exchange a public token for an access token.
 *
 * This function exchanges a public token for an access token and updates the user's Plaid access token.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} publicToken - The public token received from Plaid Link.
 * @returns {string} - The access token.
 */
const exchangePublicToken = async (userId, publicToken) => {
    const exchangeResponse = await client.itemPublicTokenExchange({
        public_token: publicToken,
    })

    const accessToken = exchangeResponse.data.access_token

    await updateUsersPlaidAccessToken(userId, accessToken)

    return accessToken
}

/**
 * Update the user's Plaid access token.
 *
 * This function updates the Plaid access token for a specific user in the database.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} accessToken - The new access token.
 */
const updateUsersPlaidAccessToken = async (userId, accessToken) => {
    try {
        const user = await User.findByPk(userId)

        if (user) {
            await user.updatePlaidAccessToken(user, accessToken)
        }
    }
    catch (error) {
        console.error('Error updating user access token:', error)
    }
}

/**
 * Link the Plaid bank accounts by storing them in the DB.
 *
 * This function retrieves accounts linked with Plaid and stores them into the database.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Object} - The accounts response data.
 */
const linkAccounts = async (userId) => {
    const user = await User.findByPk(userId)

    if (user) {
        const plaidAccessToken = user.plaid_access_token

        const accountsResponse = await client.accountsGet({ access_token: plaidAccessToken })

        if (!accountsResponse) return

        for (const account of accountsResponse.data.accounts) {
            await Account.upsert({
                account_id: account.account_id,
                persistent_account_id: account.persistent_account_id,
                user_id: user.id,
                balance: account.balances.current,
                name: account.name,
                official_name: account.official_name,
                type: account.type,
                sub_type: account.subtype
            })
        }

        return accountsResponse.data
    }
}

/**
 * Get account balances from Plaid.
 *
 * This function retrieves the balances of accounts linked with Plaid using the access token.
 *
 * @param {string} accessToken - The access token for the user's Plaid account.
 * @returns {Object} - The balance response data.
 */
const getBalance = async (accessToken) => {
    const balanceResponse = await client.accountsBalanceGet({ access_token: accessToken })

    return balanceResponse.data
}

module.exports = {
    createLinkToken,
    exchangePublicToken,
    linkAccounts,
    getBalance
}
