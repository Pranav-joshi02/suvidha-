'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboard } from '@/hooks/use-dashboard'
import { Package, DollarSign, TrendingUp, AlertTriangle, ShoppingCart, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboard() {
  const { data: kpis, isLoading } = useDashboard()

  const quickActions = [
    { name: 'Record Sale', href: '/admin/pos', icon: ShoppingCart, color: 'bg-green-500' },
    { name: 'Add Product', href: '/admin/products/new', icon: Package, color: 'bg-blue-500' },
    { name: 'View Reports', href: '/admin/reports', icon: FileText, color: 'bg-purple-500' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Over View</h2>
          <p className="text-gray-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Products
              </CardTitle>
              <Package className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">
                {isLoading ? '...' : kpis?.totalProducts || 5483}
              </div>
              <p className="text-xs text-blue-700 mt-1">Active inventory items</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Total Stock
              </CardTitle>
              <ShoppingCart className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                {isLoading ? '...' : '5483'}
              </div>
              <p className="text-xs text-green-700 mt-1">Total items in stock</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">
                {isLoading ? '...' : kpis?.lowStockCount || 38}
              </div>
              <p className="text-xs text-amber-700 mt-1">Items need restocking</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Daily Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {isLoading ? '...' : formatCurrency(kpis?.dailyRevenue || 2859)}
              </div>
              <p className="text-xs text-purple-700 mt-1">Today&apos;s total sales</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions for faster workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.name} href={action.href}>
                  <Button
                    variant="outline"
                    className="w-full h-24 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow"
                  >
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-medium">{action.name}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inventory Values */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Values</CardTitle>
              <CardDescription>Current stock valuation breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-teal-500"></div>
                    <span className="text-sm text-gray-600">Retail value</span>
                  </div>
                  <span className="font-semibold">72%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded bg-gray-400"></div>
                    <span className="text-sm text-gray-600">Total costs</span>
                  </div>
                  <span className="font-semibold">28%</span>
                </div>
                <div className="mt-4">
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-500 to-teal-400" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Stores */}
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Stores by sales</CardTitle>
              <CardDescription>Last 6 months performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Gateway 07', 'The Mall Store', 'ShanTin 04', 'Blue Haven', 'Connect Centre'].map((store, i) => (
                  <div key={store} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{store}</span>
                        <span className="text-sm font-semibold">{97 - i * 10}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-400" 
                          style={{ width: `${97 - i * 10}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}