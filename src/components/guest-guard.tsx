'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { Loader } from '@/components/ui/loader'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()

  const searchParams = useSearchParams()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Wait for the initial auth state to load
    if (isLoading) return

    // If user is authenticated, redirect to home/dashboard
    if (isAuthenticated) {
      if (searchParams && searchParams.get('callbackUrl')) {
        router.replace(searchParams.get('callbackUrl') || '/')
        return
      }

      router.replace('/')
      return
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, isLoading, router, searchParams])

  // Show loading state while checking authentication
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-8 w-8" />
      </div>
    )
  }

  // Only render children if user is not authenticated
  return <>{children}</>
}
