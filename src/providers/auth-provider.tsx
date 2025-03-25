'use client'

import { useState, useEffect, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { AuthContext, type User } from '@/contexts/auth-context'

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
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authUser')
  }

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      const data = await response.json()

      // Store token and user data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('authUser', JSON.stringify(data))

      setToken(data.token)
      setUser(data)

      // Fetch additional user profile data
      await fetchUserProfile(data.accessToken)

      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Fetch user profile
  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        // credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user profile')
      }

      const userData = await response.json()

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

      const response = await fetch('https://dummyjson.com/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refreshToken: refreshToken, // Optional, if not provided, the server will use the cookie
          expiresInMins: 30, // optional (FOR ACCESS TOKEN), defaults to 60
        }),
        credentials: 'include', // Include cookies (e.g., accessToken) in the request
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()

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
