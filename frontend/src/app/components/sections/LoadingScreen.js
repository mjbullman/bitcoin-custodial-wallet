import React from 'react'
import { CircularProgress, Box, Typography } from '@mui/material'

const LoadingScreen = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                color: 'white',
                textAlign: 'center',
                animation: 'fadeIn .5s ease-in-out',
            }}
        >
            <CircularProgress
                size={60}
                thickness={5}
                sx={{
                    color: '#61dafb',
                    animation: 'spin 2s linear infinite',
                }}
            />

            <Typography variant="h6" sx={{ marginTop: 2 }}>
                Loading, please wait...
            </Typography>
        </Box>
    )
}

export default LoadingScreen