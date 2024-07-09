'use client'

import React, { useState } from 'react'

import { useAuth } from '@/context/authContextState'
import { useRouter } from 'next/navigation'

import {
    Avatar, Button, TextField, Link,
    Box, Container, Typography, Alert
} from '@mui/material'

const Login = () => {
    const router = useRouter()
    const { login } = useAuth()

    // state variables to manage form inputs and error messages.
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)

    /**
     * Handles the form submission for user login.
     *
     * This function ends a POST request to the login API endpoint with the user's
     * email and password, and processes the response. If the response is successful,
     * the user is logged in and redirected to the dashboard. If there is an error,
     * it sets the error state with the received error messages.
     *
     * @param {Object} e - The event object representing the form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        if (response.ok) {
            const data = await response.json()
            login(data.user)
            router.push('/dashboard')
        }
        else {
            const errors = await response.json()
            setError(errors.errors)
            console.log(errors.errors)
        }
    }

    return (
        <Container maxWidth="xs">

            {error && (
                <Alert severity="error" style={{ marginTop: '20px' }}>
                    {error[0].msg}
                </Alert>
            )}

            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                minHeight="80vh">

                <Avatar sx={{ m: 1 }}></Avatar>

                <Typography component="h1" variant="h4">
                    Login
                </Typography>

                <Box component="form" onSubmit={ handleSubmit } noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={ email }
                        onChange={ (e) => setEmail(e.target.value) }
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                    />

                    <TextField
                        value={ password }
                        onChange={ (e) => setPassword(e.target.value) }
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Login
                    </Button>

                    <Typography component="div" sx={{ textAlign: 'center' }}>
                        <Link href={'signup'} variant="body2" sx={{ textAlign: 'center' }}>
                            {'Don\'t have an account? Sign Up'}
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default Login
