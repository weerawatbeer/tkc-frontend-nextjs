import * as React from 'react'

import type { AuthContextType } from '@/contexts/auth-context'
import { AuthContext } from '@/contexts/auth-context'

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
