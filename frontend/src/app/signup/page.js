'use client'

import React, { useState } from 'react'

import { useAuth } from '@/context/authContext'
import { useRouter } from 'next/navigation'

import {
    Avatar, Button, Link, Box, Container, Alert,
    Typography, TextField, FormControlLabel, Checkbox
} from '@mui/material'

const Signup = () => {
    const router = useRouter()
    const { login } = useAuth()

    // state variables to manage form inputs and error messages.
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)

    /**
     * Handles the form submission for user signup.
     *
     * This function sends a POST request to the signup API endpoint with the user's
     * name, email, and password, and processes the response. If the response is successful,
     * the user is logged in and redirected to the dashboard. If there is an error, it sets
     * the error state with the received error messages.
     *
     * @param {Object} e - The event object representing the form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault()

        let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: name,
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
                    Sign Up
                </Typography>

                <Box component="form" onSubmit={ handleSubmit } noValidate sx={{ mt: 1 }}>
                    <TextField
                        value={ name }
                        onChange={ (e) => setName(e.target.value) }
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="email"
                        autoComplete="name"
                        autoFocus
                    />

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
                        value={password}
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

                    <FormControlLabel
                        control={
                            <Checkbox
                                value={ remember }
                                onChange={ (e) => setRemember(e.target.value) }
                                margin="normal"
                                name="remember"
                                id="remember"
                            />
                        }
                        label="Remember me"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}>
                        Sign In
                    </Button>

                    <Typography component="div" sx={{ textAlign: 'center' }}>
                        <Link href={ 'login' } variant="body2">
                            Already have an account? Login
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    )
}

export default Signup
