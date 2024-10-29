const { Sequelize } = require('sequelize')

/**
 * Sequelize instance
 *
 * This instance is configured to use SQLite as the database dialect
 * and stores the database file in the specified path.
 */
const sequelize = new Sequelize({
    dialect: process.env.DATABASE_DIALECT,
    storage: process.env.DATABASE_FILE_PATH
})

/**
 * Test Database Connection
 *
 * This asynchronous function attempts to authenticate the Sequelize instance
 * with the SQLite database to ensure that the connection is successful.
 *
 * If the connection is successful, it logs a success message.
 * If the connection fails, it logs an error message.
 */
async function testConnection() {
    try {
        await sequelize.authenticate()
        console.log('Connection to database has been established successfully.')
    }
    catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}

module.exports = {
    sequelize
}
