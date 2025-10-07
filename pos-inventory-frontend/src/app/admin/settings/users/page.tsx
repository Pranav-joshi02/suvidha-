'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { UserManagement } from '@/components/settings/user-management'

export default function UsersSettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage staff users and their access permissions
          </p>
        </div>

        <UserManagement />
      </div>
    </AdminLayout>
  )
}