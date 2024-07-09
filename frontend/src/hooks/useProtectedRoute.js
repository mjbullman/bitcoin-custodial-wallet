import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/authContext'

/**
 * Custom hook to protect routes based on authentication status.
 *
 * Redirects to '/login' if user is not authenticated.
 * @returns {object} The authenticated user object.
 */
const useProtectedRoute = () => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    return user
}

export default useProtectedRoute