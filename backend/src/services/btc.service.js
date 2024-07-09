const { exec } = require('child_process')

/**
 * Generates a new Bitcoin address using the bitcoin-cli command.
 *
 * This function executes the bitcoin-cli command to generate a new Bitcoin address.
 * The path to the bitcoin-cli executable is specified through the BITCOIN_CLI_PATH
 * environment variable. The generated address or any error messages are passed to
 * the callback function.
 *
 * @param {Function} callback - The callback function to handle the generated address or error.
 * The callback takes two arguments:
 *   1. error - An error object if an error occurred, otherwise null.
 *   2. address - The generated Bitcoin address if successful, otherwise null.
 */
function generateBitcoinAddress(callback) {
    exec(`${process.env.BITCOIN_CLI_PATH} getnewaddress`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error generating address: ${error.message}`)
            callback(error, null)
            return
        }

        if (stderr) {
            console.error(`Error: ${stderr}`)
            callback(stderr, null)
            return
        }

        const address = stdout.trim()
        callback(null, address)
    })
}

module.exports = {
    generateBitcoinAddress
}
