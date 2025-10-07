'use client'

import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    async function init() {
      if (typeof window !== 'undefined') {
        const { worker } = await import('@/lib/mocks/browser')
        await worker.start({
          onUnhandledRequest: 'bypass',
        })
        setIsReady(true)
      }
    }

    init()
  }, [])

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}