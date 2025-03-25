'use client'

import type React from 'react'
import { GuestGuard } from '@/components/guest-guard'
import { Suspense } from 'react'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <GuestGuard>{children}</GuestGuard>
    </Suspense>
  )
}
