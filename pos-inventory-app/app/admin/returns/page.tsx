'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PackageOpen } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Returns</h2>
          <p className="text-gray-600">Manage product returns and refunds</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Returns Management</CardTitle>
            <CardDescription>View and process customer returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <PackageOpen className="h-16 w-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Returns feature coming soon</p>
              <p className="text-sm">This feature is under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}