'use client'

import React, { useState, useEffect } from 'react'

import PurchaseBTC from '@/app/components/crypto/PurchaseBTC'
import LoadingScreen from '@/app/components/sections/LoadingScreen'
import PlaidLinkAccount from '@/app/components/plaid/PlaidLinkAccount'
import useProtectedRoute from '@/hooks/useProtectedRoute'

import {
    Box, Divider, Container, Typography, Paper
} from '@mui/material'


const Dashboard = () => {
    const user = useProtectedRoute()
    const [accounts, setAccounts] = useState({})
    const [bitcoinBalance, setBitcoinBalance] = useState(0)

    useEffect(() => {
        getAccounts()
        getBitcoinBalance()
    }, [])

    const getAccounts = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/plaid/get_accounts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json()
            setAccounts(data)
        }
        else {
            console.log('Error getting accounts.')
        }
    }

    const getBitcoinBalance = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/bitcoin/balance`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })

        if (response.ok) {
            const data = await response.json()
            setBitcoinBalance(data)
        }
        else {
            console.log('Error getting BTC balance.')
        }
    }

    if (!user) {
        return (<LoadingScreen/>)
    }
    else {
        return (
            <Container>
                <Box my={4}>

                    <Typography color={'primary'} align="center" variant="h4" gutterBottom>
                        Crypto Wallet Dashboard
                    </Typography>

                    <Paper elevation={3} sx={{ padding: 3, marginBottom: 4 }}>
                        <Box textAlign="center" my={2}>
                            <Typography variant="h6" gutterBottom>
                                Bitcoin Wallet Balance
                            </Typography>

                            <Typography variant="h4" color="primary">
                                { bitcoinBalance.toFixed(8) } BTC
                            </Typography>
                        </Box>
                    </Paper>

                    <Divider sx={{ my: 2 }} />

                    {!accounts.length && (
                        <PlaidLinkAccount setAccounts={setAccounts} />
                    )}
                    {accounts.length > 0 && (
                        <PurchaseBTC accounts={accounts} getBitcoinBalance={getBitcoinBalance} />
                    )}
                </Box>
            </Container>
        )
    }
}

export default Dashboard
