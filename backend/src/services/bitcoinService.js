const BitcoinClient = require('bitcoin-core')

const User = require('../models/user')
const plaidService = require('../services/plaidService')

const client = new BitcoinClient({
    network: process.env.BITCOIN_NETWORK,
    username: process.env.BITCOIN_RPC_USERNAME,
    password: process.env.BITCOIN_RPC_PASSWORD,
    port: process.env.BITCOIN_PORT
})

/**
 * Retrieves the Bitcoin balance for a user.
 *
 * Retrieves the current Bitcoin balance associated with a user's Bitcoin wallet address.
 *
 * @param {string} userId - The user ID.
 * @returns {number} The total Bitcoin balance.
 * @throws {Error} If the user is not found or any error occurs during the retrieval.
 */
async function getBTCBalance (userId) {
    const user = await User.findByPk(userId)

    if (user) {
        const unspent = await client.listUnspent(0, 9999999, [user.btc_wallet_address])

        return unspent.reduce((total, tx) => total + tx.amount, 0)
    }
    else {
        throw new Error('User not found.')
    }
}

/**
 * Generates a new Bitcoin address.
 *
 * Generates a new Bitcoin address using the Bitcoin Core client.
 *
 * @returns {string} The newly generated Bitcoin address.
 * @throws {Error} If there's an error generating the Bitcoin address.
 */
async function generateBitcoinAddress() {
    const address =  await client.getNewAddress()

    if (address) {
        return address
    }
    else {
        throw new Error('Error generating Bitcoin address.')
    }
}

/**
 * Purchases Bitcoin for a user.
 *
 * Purchases a specified amount of Bitcoin using the user's Plaid account and Bitcoin wallet address.
 * Checks if the user's Plaid account balance is sufficient and if the Bitcoin client balance is sufficient.
 *
 * @param {string} userId - The user ID.
 * @param {string} accountId - The Plaid account ID.
 * @param {number} btcAmount - The amount of Bitcoin to purchase.
 * @param {number} fiatAmount - The equivalent amount in fiat currency (not used in the current implementation).
 * @returns {string} The transaction ID of the Bitcoin purchase.
 * @throws {Error} If there are insufficient funds or any other error occurs during the purchase.
 */
async function purchaseBTC (userId, accountId, btcAmount, fiatAmount) {
    const user = await User.findByPk(userId)

    if (user) {
        let account = await plaidService.getAccountById(user.plaid_access_token, accountId)

        // check the user has enough fiat in account to cover cost of BTC.
        if (account && account.balances.current > fiatAmount) {
            const balance = await client.getBalance()

            // check the bitcoin balance is sufficient.
            if (balance >= btcAmount) {
                return await client.sendToAddress(user.btc_wallet_address, btcAmount)
            }
            else {
                throw new Error('Insufficient balance to make the purchase.')
            }
        }
        else {
            throw new Error('Bank account balance insufficient to make the purchase.')
        }
    }
}

module.exports = {
    purchaseBTC,
    getBTCBalance,
    generateBitcoinAddress
}
