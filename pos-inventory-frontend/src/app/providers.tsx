'use client'

import { useEffect, useState } from 'react'
import { enableMocking } from '@/lib/mocks'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false)

  useEffect(() => {
    enableMocking().then(() => {
      setMswReady(true)
    })
  }, [])

  if (!mswReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}