import React, { useState, useEffect, useCallback } from 'react'

import { usePlaidLink } from 'react-plaid-link'
import { Button, Paper, Box, Typography } from '@mui/material'

const PlaidLinkAccount = ({ setAccounts }) => {
    const [token, setLinkToken] = useState(null)
    const [loading, setLoading] = useState(true)
    const [plaidAccessToken, setPlaidAccessToken] = useState(null)

    /**
     * Plaid createLinkToken Function
     *
     * Fetches the Plaid Link token from backend API.
     * Initiates the process of creating a new Plaid Link token
     * that is required for initializing the Plaid Link component.
     */
    const createLinkToken = useCallback(async () => {
        setLoading(true)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/create_link_token`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        const data = await response.json()
        setLinkToken(data.link_token)
    }, [])

    /**
     * Plaid linkAccounts Function
     *
     * Fetches and stores Plaid account data using the access token.
     *
     * @param {string} accessToken - Access token obtained from Plaid.
     */
    const linkAccounts = useCallback(async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/link_accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ access_token: plaidAccessToken })
        })

        if (response.ok) {
            const data = await response.json()
            setAccounts(data)
        }
        else {
            console.error('Error getting balance', await response.json())
        }
    }, [plaidAccessToken, setAccounts])

    /**
     * Plaid onSuccess Callback Function
     *
     * Triggered on successful exchange of public token for access token.
     * Handles the process of exchanging a Plaid Link public token for
     * an access token and linking user accounts.
     *
     * @param {string} publicToken - Public token obtained from Plaid Link.
     */
    const onSuccess = useCallback(async (publicToken) => {
        setLoading(true)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/exchange_public_token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                public_token: publicToken,
            })
        })

        if (response.ok) {
            const { accessToken } = await response.json()
            setPlaidAccessToken(accessToken)
            await linkAccounts()
            setLoading(false)
        }
        else {
            console.error('Error exchanging public token', await response.json())
        }
    }, [linkAccounts])

    const config = { token, onSuccess }
    const { open, ready } = usePlaidLink(config)

    useEffect(() => {
        if (!token) {
            createLinkToken()
        }
    }, [token, createLinkToken])

    return (
        <Paper elevation={3} sx={{padding: 3, marginBottom: 4}}>
            <Box textAlign="center" my={2}>
                <Typography variant="h6" gutterBottom>
                    Link Your Bank Account
                </Typography>

                <Button onClick={open} disabled={!ready} ariant="contained" color="primary" size="large">
                    <strong>Link Account</strong>
                </Button>
            </Box>
        </Paper>
    )
}

export default PlaidLinkAccount
