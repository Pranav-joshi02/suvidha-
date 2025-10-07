'use client'

import Link from 'next/link'
import { StaffLayout } from '@/components/layouts/staff-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShoppingCart, Package, Clock, BarChart3 } from 'lucide-react'
import { authUtils } from '@/lib/auth'

export default function StaffDashboard() {
  const user = authUtils.getUser()

  const quickActions = [
    {
      title: 'Record Sale',
      description: 'Process a new sale transaction',
      href: '/staff/pos',
      icon: ShoppingCart,
      color: 'bg-green-500 hover:bg-green-600',
      primary: true,
    },
    {
      title: 'Check Stock',
      description: 'View product inventory levels',
      href: '/staff/products',
      icon: Package,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Recent Sales',
      description: 'View recent transactions',
      href: '/staff/sales/history',
      icon: Clock,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Daily Report',
      description: 'View today\'s sales summary',
      href: '/staff/reports',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
  ]

  return (
    <StaffLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Ready to process sales and manage inventory
          </p>
        </div>

        {/* Primary Action */}
        <div className="flex justify-center">
          <Link href="/staff/pos">
            <Button size="lg" className="h-16 px-8 text-lg bg-green-500 hover:bg-green-600">
              <ShoppingCart className="w-6 h-6 mr-3" />
              Start New Sale
            </Button>
          </Link>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg text-white ${action.color}`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Tips Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-blue-800">
              • Use the barcode scanner or search to quickly find products
            </p>
            <p className="text-sm text-blue-800">
              • Press Tab to navigate between quantity and price fields
            </p>
            <p className="text-sm text-blue-800">
              • Check stock levels before confirming large quantity sales
            </p>
          </CardContent>
        </Card>
      </div>
    </StaffLayout>
  )
}