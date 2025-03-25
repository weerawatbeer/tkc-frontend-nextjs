'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader } from '@/components/ui/loader'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for the initial auth state to load
      if (isLoading) return

      // Define protected routes
      const protectedRoutes = ['/test2']
      const isProtectedRoute = protectedRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      )

      if (!isProtectedRoute) {
        setIsChecking(false)
        return
      }

      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      setIsChecking(false)
    }

    checkAuth()
  }, [isAuthenticated, isLoading, pathname, router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8" />
      </div>
    )
  }

  return <>{children}</>
}
