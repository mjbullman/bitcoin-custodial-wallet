'use client'

import React from 'react'

import Link from 'next/link'
import Steps from '@/app/components/sections/Steps'

import {
    Grid, Container, Typography, Button
} from '@mui/material'

const Home = () => {
    return (
        <Container>
            <Typography variant="h2" component="h1"  color="primary" sx={{
                p: 3, textAlign: 'center', typography: { xs: 'h5', sm: 'h4', md: 'h3' }
            }}>

                Bitcoin Custodial Wallet

            </Typography>

            <Grid container spacing={{ xs: 2, md: 3 }} marginTop="10">
                <Grid xs={12} item>
                    <Typography variant="h4" color="secondary" sx={{
                        p: 4, textAlign: 'center', typography: { xs: 'h6', sm: 'h5', md: 'h4' }
                    }}>

                        Get started now!

                    </Typography>
                </Grid>

                <Steps/>
            </Grid>

            <Grid display="flex" justifyContent="center" sx={{ pt: 2 }}>
                <Link href={'signup'} passHref>
                    <Button size="large" variant="contained" color="primary" sx={{ m: 3 }}>

                        Get Started

                    </Button>
                </Link>
            </Grid>
        </Container>
    )
}

export default Home
