'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { GeneralSettings } from '@/components/settings/general-settings'

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your shop settings and preferences
          </p>
        </div>

        <GeneralSettings />
      </div>
    </AdminLayout>
  )
}