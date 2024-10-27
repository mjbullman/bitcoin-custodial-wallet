const { DataTypes } = require('sequelize')
const { sequelize } = require('../services/dbService')

/**
 * Account Model
 *
 * Represents an account associated with a user.
 *
 * Fields:
 * - `account_id`: Unique identifier for the account (STRING, required).
 * - `persistent_account_id`: Persistent identifier for the account (STRING, required).
 * - `user_id`: ID of the user who owns the account (INTEGER, required). References `Users` table.
 * - `balance`: current balance of account
 * - `name`: Name of the account (STRING, required).
 * - `official_name`: Official name of the account (STRING, required).
 * - `type`: Type of the account (STRING, required).
 * - `sub_type`: SubType of the account (STRING, required).
 * - `timestamps`: Automatically manages createdAt and updatedAt timestamps (BOOLEAN).
 */
const Account = sequelize.define('Account', {
    account_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    persistent_account_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    official_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sub_type: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Account
