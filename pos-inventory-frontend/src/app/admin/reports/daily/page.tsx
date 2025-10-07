'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { SalesChart } from '@/components/reports/sales-chart'
import { useDailyReports } from '@/hooks/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

export default function DailyReportsPage() {
  const { data: reports, isLoading } = useDailyReports()

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading daily reports...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const totalRevenue = reports?.reduce((sum, report) => sum + report.revenue, 0) || 0
  const totalProfit = reports?.reduce((sum, report) => sum + report.profit, 0) || 0
  const totalSales = reports?.reduce((sum, report) => sum + report.salesCount, 0) || 0

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Reports</h1>
          <p className="text-gray-600 mt-1">
            View daily sales performance and trends
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue (30 days)</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit (30 days)</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales (30 days)</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        {reports && reports.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart
              data={reports}
              type="line"
              title="Daily Sales Trend (Last 30 Days)"
            />
            <SalesChart
              data={reports}
              type="bar"
              title="Daily Revenue vs Profit"
            />
          </div>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                No sales data available for the last 30 days
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}