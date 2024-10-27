import React, { useState, useEffect } from 'react'

import {
    Container, Box, Typography, TextField, Button, CircularProgress,
    Dialog, List, ListItem, ListItemIcon, ListItemText, DialogTitle,
    DialogContent, Select, Grid, MenuItem, InputLabel, FormControl,
    DialogActions, Avatar, Paper
} from '@mui/material'

const BtcPurchase = ({ accounts, getBitcoinBalance }) => {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [amount, setAmount] = useState('')
    const [btcPrice, setBtcPrice] = useState(null)
    const [btcAmount, setBtcAmount] = useState(0)
    const [selectedAccount, setSelectedAccount] = useState('')

    useEffect(() => {
        fetchBtcPrice()
    }, [])

    /**
     * Handles fetching the current Bitcoin price from the CoinGecko API.
     *
     * This function sends a GET request to the CoinGecko API endpoint to fetch
     * the current price of Bitcoin in USD. If the request is successful,
     * it updates the state variable `btcPrice` with the fetched price. If
     * the request fails, an error message is logged to the console.
     */
    const fetchBtcPrice = async () => {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')

        if (response.ok) {
            const data = await response.json()
            setBtcPrice(data.bitcoin.usd)
        }
        else {
            console.error('Error fetching BTC price')
        }
    }

    /**
     * Handles changes in the input amount field and calculates BTC amount.
     *
     * This function updates the state variable `amount` with the value entered
     * into the input field. If both `btcPrice` and the entered value are valid,
     * it calculates the equivalent BTC amount and updates the state variable
     * `btcAmount` with the calculated amount. If `btcPrice` or the entered
     * value is invalid or empty, it sets `btcAmount` to 0.
     *
     * @param {Object} e - The event object representing the input change event.
     */
    const handleAmountChange = (e) => {
        const value = e.target.value
        setAmount(value)

        if (btcPrice && value) {
            const result = value / btcPrice
            setBtcAmount(parseFloat(result.toFixed(8)))
        }
        else {
            setBtcAmount(0)
        }
    }

    /**
     * Handles advancing to the next step in the transaction process.
     *
     * This function advances the state variable `step` to 2, indicating
     * progression to the next step in the transaction process.
     *
     * @param {Object} e - The event object representing the click event.
     */
    const handleNextStep = (e) => {
        e.preventDefault()
        setStep(2)
    }

    /**
     * Handles confirming the Bitcoin purchase via API call.
     *
     * This function closes the dialog window, sends a POST request to the
     * Bitcoin purchase API endpoint with the entered BTC amount and selected
     * account ID. Upon successful confirmation, it resets the input fields,
     * updates the transaction step to 1, fetches the updated Bitcoin balance,
     * and alerts the user with a success message. If there is an error during
     * the purchase confirmation, it logs an error message to the console.
     */
    const handleConfirm = async () => {
        setOpen(false)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/bitcoin/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                btc_amount: parseFloat(btcAmount.toFixed(8)),
                account_id: selectedAccount,
                amount: amount,
            })
        })

        if (response.ok) {
            const data = await response.json()
            setAmount('')
            setBtcAmount(0)
            setStep(1)
            getBitcoinBalance()

            alert(`Successfully confirmed Purchase: ${data}`)
        }
        else {
            const data = await response.json()
            alert(data)
        }
    }

    /**
     * Handles navigating back to the previous step in the transaction process.
     */
    const handleBack = () => {
        setStep(1)
    }

    /**
     * Handles closing the dialog window.
     */
    const handleClose = () => {
        setOpen(false)
    }

    /**
     * Handles opening the dialog window.
     */
    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <Paper elevation={3} sx={{ mt: 5, padding: 4, marginBottom: 4}}>
            <Box textAlign="center">
                <Box textAlign="center" my={2}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 4, p:0 }}>
                        Purchase Bitcoin to Update balance
                    </Typography>

                    <Button onClick={handleOpen} variant="contained" color="primary">
                        Purchase Bitcoin
                    </Button>
                </Box>

                <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                    <DialogTitle sx={{ textAlign: 'center' }}>
                        <Typography color={'primary'} variant="h5" component="p" gutterBottom>
                            {step === 1 ? 'Purchase Bitcoin' : 'Order Preview'}
                        </Typography>
                    </DialogTitle>

                    <DialogContent>
                        {btcPrice ? ( step === 1 ? (
                            <form onSubmit={handleNextStep}>
                                <TextField
                                    label="Amount in USD"
                                    type="number"
                                    variant="outlined"
                                    fullWidth
                                    value={amount}
                                    onChange={handleAmountChange}
                                    required
                                    margin="normal"
                                />

                                <Typography marginTop={1} marginBottom={0} color={'primary'} variant="body1" component="p" gutterBottom>
                                    { btcAmount.toFixed(8) } BTC
                                </Typography>

                                <List component="nav">
                                    <ListItem sx={{ p: 0 }}>
                                        <ListItemIcon>
                                            <Avatar src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032"></Avatar>
                                        </ListItemIcon>

                                        <ListItemText primary="Buy" secondary="Bitcoin"/>
                                    </ListItem>
                                </List>

                                <FormControl fullWidth sx={{ mt: 1 }}>
                                    <InputLabel id="demo-simple-select-label">Account *</InputLabel>

                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={selectedAccount}
                                        fullWidth
                                        label="Account"
                                        onChange={(e) => setSelectedAccount(e.target.value)}
                                        margin="normal"
                                        required>

                                        {accounts.map((account) => (
                                            <MenuItem key={account.account_id} value={account.account_id}>
                                                {account.name} - ${account.balance}
                                            </MenuItem>
                                        ))}

                                    </Select>

                                </FormControl>

                                <DialogActions sx={{ mt: 3, p:0 }}>
                                    <Button onClick={ handleClose } color="secondary">
                                        Cancel
                                    </Button>

                                    <Button type="submit" variant="contained" color="primary">
                                        Review Order
                                    </Button>
                                </DialogActions>
                            </form>
                        ) : (
                            <>
                                <Typography variant="h5" align="center" color="secondary">
                                    { btcAmount.toFixed(8)} BTC
                                </Typography>

                                <Box mt={2}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="left" color="primary">
                                                <strong>
                                                    Pay with
                                                </strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="right">
                                                { accounts.find(acc => acc.account_id === selectedAccount)?.name }
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="left" color="primary">
                                                <strong>
                                                    Price
                                                </strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="right">
                                                ${ btcPrice } / BTC
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="left" color="primary">
                                                <strong>
                                                    Purchase
                                                </strong>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body1" align="right">
                                                ${ amount }
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>

                                <DialogActions sx={{ mt: 3, p:0 }}>
                                    <Button onClick={ handleBack } color="secondary">
                                        Back
                                    </Button>

                                    <Button onClick={ handleConfirm } variant="contained" color="primary">
                                        Confirm
                                    </Button>
                                </DialogActions>
                            </>
                        )) : (
                            <Box display="flex" justifyContent="center" alignItems="center">
                                <CircularProgress />
                            </Box>
                        )}
                    </DialogContent>
                </Dialog>
            </Box>
        </Paper>
    )
}

export default BtcPurchase
