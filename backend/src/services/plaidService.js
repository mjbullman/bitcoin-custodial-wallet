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
 * Creates a link token for Plaid Link integration.
 *
 * This function generates a link token that is used in Plaid Link integration for connecting
 * a user's bank account securely. It specifies the client user ID, client name, language,
 * products, country codes, and redirect URI for Plaid Link.
 *
 * @param {string} userId - The user ID to associate with the link token.
 * @returns {Object} The link token data.
 * @throws {Error} If there's an issue creating the link token.
 */
const createLinkToken = async (userId) => {
    const token = await client.linkTokenCreate({
        user: { client_user_id: userId.toString() },
        client_name: 'Exodus Custodial Wallet',
        language: 'en',
        products: ['auth'],
        country_codes: ['US'],
        redirect_uri: process.env.PLAID_REDIRECT_URI,
    })

    if (token) {
        return token.data
    }
    else {
        throw new Error('Creating link token.')
    }
}

/**
 * Exchanges a Plaid public token for an access token.
 *
 * This function exchanges a public token obtained from Plaid Link for an access token.
 * It then updates the user's Plaid access token in the database for future API requests.
 *
 * @param {string} userId - The user ID associated with the Plaid token.
 * @param {string} publicToken - The public token to exchange.
 * @returns {string} The access token.
 * @throws {Error} If there's an issue exchanging the public token.
 */
const exchangePublicToken = async (userId, publicToken) => {
    const exchange = await client.itemPublicTokenExchange({
        public_token: publicToken,
    })

    if (exchange) {
        const accessToken = exchange.data.access_token
        await updateUsersPlaidAccessToken(userId, accessToken)

        return accessToken
    }
    else {
        throw new Error(`Error exchange public token ${publicToken}.`)
    }
}

/**
 * Retrieves the account balances associated with a Plaid access token.
 *
 * This function retrieves the current balances for all accounts associated with the provided
 * Plaid access token.
 *
 * @param {string} accessToken - The Plaid access token.
 * @returns {Object} The balances data.
 * @throws {Error} If there's an issue retrieving the balances.
 */
const getBalance = async (accessToken) => {
    const balances = await client.accountsBalanceGet({ access_token: accessToken })

    if (balances) {
        return balances.data
    }
    else {
        throw new Error('No Balances found.')
    }
}

/**
 * Retrieves linked accounts from the database based on user ID.
 *
 * This function retrieves all linked accounts stored in the database for a specific user.
 *
 * @param {string} userId - The user ID.
 * @returns {Array} Array of linked account objects.
 */
const getAccounts = async (userId) => {
    return Account.findAll({where: {user_id: userId}})
}

/**
 * Links users Plaid bank accounts.
 *
 * This function links a user's bank accounts using Plaid by fetching and storing account information
 * from Plaid's API.
 *
 * @param {string} userId - The user ID to link accounts for.
 * @returns {Array} Array of linked account objects.
 * @throws {Error} If there's an issue linking accounts.
 */
const linkAccounts = async (userId) => {
    const user = await User.findByPk(userId)

    if (user) {
        const accounts = await listPlaidBankAccounts(user.plaid_access_token)

        if (accounts) {
            for (const account of accounts) {
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

            return accounts
        }
        else {
            throw new Error('No Accounts found.')
        }
    }
    else {
        throw new Error('User not found.')
    }
}

/**
 * Lists Plaid bank accounts associated with a Plaid access token.
 *
 * This function lists all bank accounts associated with a Plaid access token.
 *
 * @param {string} plaidAccessToken - The Plaid access token.
 * @returns {Array} Array of Plaid bank account objects.
 * @throws {Error} If there's an issue listing accounts.
 */
const listPlaidBankAccounts = async (plaidAccessToken) => {
    const accounts = await client.accountsGet({ access_token: plaidAccessToken })

    if (accounts) {
        return accounts.data.accounts
    }
    else {
        throw new Error('No Accounts.')
    }
}


/**
 * Retrieves a specific Plaid bank account by account ID.
 *
 * This function retrieves a specific bank account associated with a Plaid access token,
 * identified by the account ID.
 *
 * @param {string} plaidAccessToken - The Plaid access token.
 * @param {string} accountId - The account ID to retrieve.
 * @returns {Object} The account object.
 * @throws {Error} If the account is not found.
 */
const getAccountById = async (plaidAccessToken, accountId) => {
    const accounts = await listPlaidBankAccounts(plaidAccessToken)
    const account = accounts.find(acc => acc.account_id === accountId)

    if (account) {
        return account
    }
    else {
        throw new Error('Account not found.')
    }
}

/**
 * Updates the user's Plaid access token in the database.
 *
 * This function updates the Plaid access token for a user in the database.
 *
 * @param {string} userId - The user ID.
 * @param {string} accessToken - The new Plaid access token.
 * @throws {Error} If there's an issue updating the access token.
 */
const updateUsersPlaidAccessToken = async (userId, accessToken) => {
    const user = await User.findByPk(userId)

    if (user) {
        await user.updatePlaidAccessToken(user, accessToken)
    }
    else {
        throw new Error('User not found')
    }
}

module.exports = {
    getBalance,
    getAccounts,
    linkAccounts,
    getAccountById,
    createLinkToken,
    exchangePublicToken,
    updateUsersPlaidAccessToken
}
