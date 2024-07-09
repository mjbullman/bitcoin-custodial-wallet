'use client'

import React from 'react'

import Link from 'next/link'
import { useAuth } from '@/context/authContextState'

import {
    AppBar, Avatar, Button, Toolbar, Typography
} from '@mui/material'

const NavBar = () =>  {
    const { user, logout } = useAuth()

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    <Link href={user ? 'dashboard' : '/'} passHref>
                        <Avatar src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032" sx={{ m: 1 }}></Avatar>
                    </Link>
                </Typography>

                {user ? (
                    <>
                        <Button onClick={logout} variant="outlined" color="secondary" sx={{ mr: 1 }}>
                            Logout
                        </Button>

                        <Link href={'dashboard'} passHref>
                            <Button variant="contained" color="primary">
                                DashBoard
                            </Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href={'login'} passHref>
                            <Button variant="outlined" color="secondary" sx={{mr: 1}}>
                                Login
                            </Button>
                        </Link>

                        <Link href={'signup'} passHref>
                            <Button variant="contained" color="primary">
                                Signup
                            </Button>
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}

export default NavBar
