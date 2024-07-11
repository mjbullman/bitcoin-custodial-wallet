'use strict'

/**
 * This migration creates the `Accounts` table.
 *
 * Fields:
 * - `id`: Auto-incrementing primary key
 * - `account_id`: Unique identifier for the account
 * - `persistent_account_id`: Persistent identifier for the account
 * - `user_id`: ID of the user associated with the account (foreign key referencing `Users` table)
 * - `balance`: current balance of account
 * - `name`: Name of the account
 * - `official_name`: Official name of the account
 * - `type`: Type of the account
 * - `sub_type`: SubType of the account
 * - `createdAt`: Timestamp of creation
 * - `updatedAt`: Timestamp of last update
 */
module.exports = {
    /**
     * Apply the migration: create the `Account` table.
     *
     * @param {object} queryInterface - Sequelize Query Interface
     * @param {object} Sequelize - Sequelize library
     */
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Accounts', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            account_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            persistent_account_id: {
                type: Sequelize.STRING,
                allowNull: false
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id'
                }
            },
            balance: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            official_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sub_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false
            }
        })
    },

    /**
     * Rollback the migration: drop the `Account` table.
     *
     * @param {object} queryInterface - Sequelize Query Interface
     * @param {object} Sequelize - Sequelize library
     */
    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('Accounts')
    }
}
