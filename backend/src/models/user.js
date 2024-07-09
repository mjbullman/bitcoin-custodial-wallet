const bcrypt = require('bcryptjs')
const { DataTypes } = require('sequelize')
const { sequelize } = require('../services//db.service')

/**
 * User Model
 *
 * This model represents the User entity in the database.
 * It includes fields for name, email, password, bitcoin address, and address.
 *
 * Passwords are hashed before being saved to the database to ensure security.
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
    bitcoinAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
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

module.exports = User
