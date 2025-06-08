import { useState, useEffect } from 'react'
import { authService, type User } from '@/lib/auth'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const userData = await authService.getCurrentUser()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = () => {
    fetchUser()
  }

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  return {
    user,
    isLoading,
    error,
    refreshUser
  }
} 