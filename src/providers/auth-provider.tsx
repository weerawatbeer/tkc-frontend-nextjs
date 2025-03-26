'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext, type User } from '@/contexts/auth-context'
import api from '@/lib/axios'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken')
      const storedUser = localStorage.getItem('authUser')

      if (storedToken && storedUser) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode<{ exp: number }>(storedToken)
          const currentTime = Date.now() / 1000

          if (decodedToken.exp < currentTime) {
            // Token is expired, try to refresh
            const refreshed = await refreshTokenInternal()
            if (!refreshed) {
              // If refresh failed, clear auth state
              clearAuthState()
            }
          } else {
            // Token is valid, set auth state
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
          }
        } catch (error) {
          console.error('Error initializing auth:', error)
          clearAuthState()
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // Clear auth state (used for logout and token expiration)
  const clearAuthState = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('authUser')
  }

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      })

      const data = response.data

      // Store token and user data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('authUser', JSON.stringify(data))

      setToken(data.accessToken)
      setUser(data)

      // Fetch additional user profile data
      await fetchUserProfile()

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/auth/me')
      const userData = response.data

      // Update user data with additional profile information
      const updatedUser = { ...user, ...userData }
      localStorage.setItem('authUser', JSON.stringify(updatedUser))
      setUser(updatedUser)

      return userData
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  // Internal refresh token function
  const refreshTokenInternal = async (): Promise<boolean> => {
    try {
      const currentToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (!currentToken) {
        return false
      }

      // Using axios directly here instead of the api instance
      // because we need to handle this specific case separately
      const response = await api.post(
        'https://dummyjson.com/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )

      const data = response.data

      // Update token in state and localStorage
      localStorage.setItem('accessToken', data.accessToken)
      setToken(data.accessToken)

      return true
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  // Public refresh token function
  const refreshToken = async (): Promise<boolean> => {
    return await refreshTokenInternal()
  }

  // Logout function
  const logout = () => {
    clearAuthState()
  }

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    refreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
