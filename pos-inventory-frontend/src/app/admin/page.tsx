'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { KPIGrid } from '@/components/dashboard/KPIGrid'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()

  const { data: kpiData, isLoading: kpiLoading } = useQuery({
    queryKey: ['kpis'],
    queryFn: () => apiClient.getKPIs(),
  })

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!isAdmin) {
        router.push('/staff')
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening in your store.</p>
        </div>

        <KPIGrid data={kpiData || { totalProducts: 0, dailyRevenue: 0, dailyProfit: 0, lowStockCount: 0 }} isLoading={kpiLoading} />

        <QuickActions />
      </div>
    </AdminLayout>
  )
}