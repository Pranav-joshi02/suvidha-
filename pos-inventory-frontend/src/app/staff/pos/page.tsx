'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StaffLayout } from '@/components/layout/StaffLayout'
import { PointOfSale } from '@/components/pos/PointOfSale'
import { useAuth } from '@/contexts/AuthContext'

export default function StaffPOSPage() {
  const { isAuthenticated, isStaff, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!isStaff) {
        router.push('/admin')
      }
    }
  }, [isAuthenticated, isStaff, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isStaff) {
    return null
  }

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600">Process sales quickly and efficiently.</p>
        </div>
        <PointOfSale />
      </div>
    </StaffLayout>
  )
}