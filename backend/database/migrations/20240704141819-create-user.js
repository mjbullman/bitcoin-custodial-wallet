'use strict'

/**
 * This migration creates the `Users` table.
 *
 * - `id`: Auto-incrementing primary key
 * - `name`: User's name
 * - `email`: User's email address
 * - `password`: User's password (hashed)
 * - `bitcoinAddress`: User's Bitcoin wallet address
 * - `address`: User's home address
 * - `createdAt`: Timestamp of creation
 * - `updatedAt`: Timestamp of last update
 */
module.exports = {
    /**
     * Apply the migration: create the `Users` table.
     *
     * @param {object} queryInterface - Sequelize Query Interface
     * @param {object} Sequelize - Sequelize library
     */
    async up (queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING
            },
            email: {
                type: Sequelize.STRING
            },
            password: {
                type: Sequelize.STRING
            },
            bitcoinAddress: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        })
    },

    /**
     * Rollback the migration: drop the `Users` table.
     *
     * @param {object} queryInterface - Sequelize Query Interface
     * @param {object} Sequelize - Sequelize library
     */
    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('Users')
    }
}
