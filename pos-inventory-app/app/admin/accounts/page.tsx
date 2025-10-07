'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase } from 'lucide-react'

export default function AccountsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accounts</h2>
          <p className="text-gray-600">Manage financial accounts and transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Accounts Management</CardTitle>
            <CardDescription>View and manage financial accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Briefcase className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Accounts feature coming soon</p>
              <p className="text-sm">This feature is under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}