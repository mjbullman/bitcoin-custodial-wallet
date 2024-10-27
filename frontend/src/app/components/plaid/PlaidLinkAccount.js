import React, { useState, useEffect, useCallback } from 'react'

import { usePlaidLink } from 'react-plaid-link'
import { Button } from '@mui/material'

const PlaidLinkAccount = () => {
    const [data, setData] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

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

        try {
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
                await linkAccounts(accessToken)
            }
            else {
                console.error('Error exchanging public token', await response.json())
            }
        }
        catch (error) {
            console.error('Network error exchanging public token', error)
        }
    }, [])

    /**
     * Plaid createLinkToken Function
     *
     * Fetches the Plaid Link token from backend API.
     * Initiates the process of creating a new Plaid Link token
     * that is required for initializing the Plaid Link component.
     */
    const createLinkToken = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/create_link_token`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const data = await response.json()

            setToken(data.link_token)
        }
        catch (error) {
            console.error('Error creating link token', error)
        }
    }, [])

    /**
     * Plaid linkAccounts Function
     *
     * Fetches and stores Plaid account data using the access token.
     *
     * @param {string} accessToken - Access token obtained from Plaid.
     */
    const linkAccounts = useCallback(async (accessToken) => {
        setLoading(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/link_accounts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ access_token: accessToken })
            })

            if (response.ok) {
                const data = await response.json()
                setData(data)
                setLoading(false)
            }
            else {
                console.error('Error getting balance', await response.json())
            }
        }
        catch (error) {
            console.error('Network error getting balance', error)
        }
    }, [])

    const config = { token, onSuccess }
    const { open, ready } = usePlaidLink(config)

    useEffect(() => {
        if (!token) {
            createLinkToken()
        }
    }, [token, createLinkToken])

    return (
        <div>
            <Button  onClick={open} disabled={!ready}>
                <strong>Link Account</strong>
            </Button>
        </div>
    )
}

export default PlaidLinkAccount
