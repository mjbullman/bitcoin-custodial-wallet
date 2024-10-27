import React from 'react'

import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined'

import {
    Grid, Paper, Typography, Box, Avatar
} from '@mui/material'

const StepItem = ({ stepNumber, icon: Icon, label }) => (
    <Grid item xs={12} md={4}>
        <Paper component="div" sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" color="secondary">
                { stepNumber }
            </Typography>

            <Box sx={{ pt: 2, display: 'flex', justifyContent: 'center' }}>
                <Avatar sx={{ width: 60, height: 60, bgcolor: 'primary.main' }}>
                    <Icon sx={{ width: 40, height: 40, color: 'white' }} />
                </Avatar>
            </Box>

            <Box sx={{ pt: 2, textAlign: 'center' }}>
                <Typography variant="h5">
                    { label }
                </Typography>
            </Box>
        </Paper>
    </Grid>
)

const Steps = () => (
    <Grid container spacing={2}>
        <StepItem
            stepNumber="01"
            icon={ LoginOutlinedIcon }
            label="Sign Up"
        />

        <StepItem
            stepNumber="02"
            icon={ AccountBalanceOutlinedIcon }
            label="Link Bank Account"
        />

        <StepItem
            stepNumber="03"
            icon={ AttachMoneyOutlinedIcon }
            label="Buy Crypto"
        />
    </Grid>
)

export default Steps
