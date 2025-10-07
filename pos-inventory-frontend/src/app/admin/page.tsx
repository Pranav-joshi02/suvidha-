'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { KPICards } from '@/components/dashboard/kpi-cards'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to your POS and inventory management system
          </p>
        </div>

        {/* KPI Cards */}
        <KPICards />

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </AdminLayout>
  )
}