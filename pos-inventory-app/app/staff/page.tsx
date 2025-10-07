'use client'

import { StaffLayout } from '@/components/layouts/staff-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, Clock } from 'lucide-react'
import Link from 'next/link'

export default function StaffDashboard() {
  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Staff Dashboard</h2>
          <p className="text-gray-600">Quick access to your daily tasks</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/staff/pos">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-2">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Record Sale</CardTitle>
                <CardDescription>
                  Process customer transactions and generate receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Open POS</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/staff/inventory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Check Stock</CardTitle>
                <CardDescription>
                  View product availability and stock levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Inventory
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Clock className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="font-medium">No recent sales</p>
                  <p className="text-sm text-gray-600">Start recording sales to see activity</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  )
}