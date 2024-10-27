'use client'

import React from 'react'

import useProtectedRoute from '@/hooks/useProtectedRoute'

import {
    Avatar, Box, Button, Container, Typography
} from '@mui/material'

import PlaidLinkAccount from '@/app/components/plaid/PlaidLinkAccount'

const Dashboard = () => {
    const user = useProtectedRoute()

    if (!user) {
        return (
            <p>loading...</p>
        )
    }
    else {
        return (
            <Container maxWidth="xs">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="80vh">

                    <Avatar sx={{m: 1}}></Avatar>

                    <Typography component="h1" variant="h4">Secure Dashboard</Typography>

                    <Typography component="h1" variant="h4">Balance</Typography>

                    <Typography component="h1" variant="h4">€0</Typography>

                    <PlaidLinkAccount></PlaidLinkAccount>

                </Box>
            </Container>
        )
    }
}

export default Dashboard
