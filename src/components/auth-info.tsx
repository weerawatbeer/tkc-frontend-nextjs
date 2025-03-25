'use client'
import { useAuth } from '@/hooks/use-auth'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Skeleton } from './ui/skeleton'

export default function AuthInfo() {
  const { logout, isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <Skeleton className="h-10 w-[250px]" />

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-start">
        <p>Authenticated : {isAuthenticated ? 'Yes' : 'No'} </p>
        {isAuthenticated && (
          <>
            <p>First Name: {user?.firstName}</p>
            <p>Last Name: {user?.lastName}</p>
          </>
        )}
      </div>
      {isAuthenticated ? (
        <Button onClick={logout} variant="outline" className="cursor-pointer">
          Logout
        </Button>
      ) : (
        <Link
          href="/login"
          className="flex h-10 w-[120px] flex-row items-center justify-center rounded-xl border bg-[#7579FF] text-center font-medium text-white"
        >
          Login
        </Link>
      )}
    </div>
  )
}
