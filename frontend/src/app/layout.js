import * as React from 'react'

import Theme from '@/theme/theme'
import NavBar from '@/app/components/layout/NavBar'
import CssBaseline from '@mui/material/CssBaseline'
import { AuthProvider } from '@/context/authContext'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

import './globals.css'

import {
    Box, Container
} from '@mui/material'

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <AppRouterCacheProvider>
                    <ThemeProvider theme={ Theme }>
                        <AuthProvider >
                            <CssBaseline/>

                            <NavBar></NavBar>

                            <Container>
                                <Box sx={{ my: 4 }}>
                                    { children }
                                </Box>
                            </Container>
                        </AuthProvider>
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    )
}

export default Layout
