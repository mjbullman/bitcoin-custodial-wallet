'use client'

import React, { createContext, useEffect, useState, useContext } from 'react'

import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

/**
 * AuthProvider component to provide authentication context to its children.
 *
 * @param {object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components that need access to the auth context.
 * @returns {JSX.Element} The AuthContext.Provider component wrapping the children with the auth context value.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()

    useEffect (() => {
        authCheck()
    }, [router])

    /**
     * Function to log in a user by setting the user state.
     *
     * @param {object} userData - The user data to set in the state.
     */
    const login = (userData) => {
        setUser(userData)
        setLoading(false)
    }

    /**
     * Function to log out a user.
     *
     * Clears the user state, removes authentication token from cookies,
     * and redirects the user to the login page.
     */
    const logout = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/logout`, {
            method: 'GET',
            credentials: 'include',
        })

        if (response.ok) {
            Cookies.remove('token')
            setUser(null)
            router.push('/login')
        }
    }

    /**
     * Check authentication status by fetching user data from the server.
     *
     * If authenticated, updates user state; if not, clears user state and removes token.
     */
    const authCheck = async () => {
        setLoading(false)
        const token = Cookies.get('token')

        if (token) {
            setLoading(true)
            let response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/auth/check`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
                setLoading(false)
            }
            else {
                Cookies.remove('token')
                setUser(null)
                setLoading(false)
            }
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            { children }
        </AuthContext.Provider>
    )
}

/**
 * Custom hook to use the authentication context.
 *
 * @returns {object} The context value containing user information and auth functions.
 */
export const useAuth = () => useContext(AuthContext)
