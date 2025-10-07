'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = authUtils.getUser()
    
    if (user) {
      // Redirect based on user role
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/staff')
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}