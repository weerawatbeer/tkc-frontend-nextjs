'use client'

import { createContext } from 'react'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  image: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

// Create the context with a default undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
