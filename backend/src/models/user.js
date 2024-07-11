const bcrypt = require('bcryptjs')
const { DataTypes } = require('sequelize')
const { sequelize } = require('../services/dbService')

/**
 * User Model
 *
 * Represents a user in the application, storing their basic information and authentication details.
 *
 * Fields:
 * - `name`: User's full name (STRING, required).
 * - `email`: User's email address, used for login (STRING, required).
 * - `password`: Hashed password for security (STRING, required). Automatically hashed using bcrypt before saving.
 * - `address`: User's physical address (STRING, optional).
 * - `btc_wallet_address`: User's Bitcoin wallet address (STRING, optional, unique).
 * - `plaid_access_token`: Token for accessing Plaid API (STRING, optional, unique).
 *
 * Passwords are hashed using bcrypt with a salt factor of 10 before being stored in the database.
 */
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(value) {
            // hash password before saving to database
            const hashedPassword = bcrypt.hashSync(value, 10)
            this.setDataValue('password', hashedPassword)
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    btc_wallet_address: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    plaid_access_token: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    }
})

/**
 * Verify Password Method
 *
 * This method compares a plaintext password with the hashed password stored in the database.
 * It returns true if the passwords match, and false otherwise.
 *
 * @param {string} password - The plaintext password to verify.
 * @returns {boolean} - Returns true if the password matches, otherwise false.
 */
User.prototype.verifyPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

/**
 * Update Plaid Access Token
 *
 * Updates the Plaid access token for the user instance.
 *
 * @param {User} user - The user instance to update.
 * @param {string} plaidAccessToken - The new Plaid access token to set.
 * @returns {Promise<void>} - Promise resolving with no value on success, or rejecting with an error on failure.
 */
User.prototype.updatePlaidAccessToken = async (user, plaidAccessToken) => {
    try {
        await user.update({plaid_access_token: plaidAccessToken})
    }
    catch (error) {
        console.error(`Error updating user: ${error.message}`)
    }
}

/**
 * toJSON Method Override
 *
 * This method is used by Sequelize to convert the User instance to JSON.
 * We override it to exclude sensitive fields like password, createdAt, updatedAt, and plaid_access_token.
 */
User.prototype.toJSON = function () {
    const values = Object.assign({}, this.get())
    delete values.password
    delete values.createdAt
    delete values.updatedAt
    delete values.plaid_access_token

    return values
}

module.exports = User
