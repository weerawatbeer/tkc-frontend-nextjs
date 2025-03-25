import type React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

import type { LucideProps } from 'lucide-react'

type LoaderProps = Omit<LucideProps, 'ref'> &
  React.HTMLAttributes<SVGSVGElement>

export function Loader({ className, ...props }: LoaderProps) {
  return (
    <Loader2 className={cn('h-4 w-4 animate-spin', className)} {...props} />
  )
}
