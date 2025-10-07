'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useBalanceSheet, useTopProducts } from '@/hooks/use-reports'
import { formatCurrency, formatDate } from '@/lib/utils'
import { exportBalanceSheetToCSV, exportBalanceSheetToPDF } from '@/lib/export'
import { Download, FileText, Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { addDays, startOfDay, startOfMonth, startOfQuarter, startOfYear, subDays, subMonths, subQuarters } from 'date-fns'

type DatePreset = 'today' | 'last7days' | 'thismonth' | 'lastmonth' | 'thisquarter' | 'thisyear'

export default function ReportsPage() {
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0])
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0])

  const { data: balanceSheet, isLoading } = useBalanceSheet(fromDate, toDate)
  const { data: topProducts } = useTopProducts(5, fromDate, toDate)

  const applyPreset = (preset: DatePreset) => {
    setDatePreset(preset)
    const today = new Date()
    
    switch (preset) {
      case 'today':
        setFromDate(today.toISOString().split('T')[0])
        setToDate(today.toISOString().split('T')[0])
        break
      case 'last7days':
        setFromDate(subDays(today, 6).toISOString().split('T')[0])
        setToDate(today.toISOString().split('T')[0])
        break
      case 'thismonth':
        setFromDate(startOfMonth(today).toISOString().split('T')[0])
        setToDate(today.toISOString().split('T')[0])
        break
      case 'lastmonth':
        const lastMonth = subMonths(today, 1)
        setFromDate(startOfMonth(lastMonth).toISOString().split('T')[0])
        setToDate(subDays(startOfMonth(today), 1).toISOString().split('T')[0])
        break
      case 'thisquarter':
        setFromDate(startOfQuarter(today).toISOString().split('T')[0])
        setToDate(today.toISOString().split('T')[0])
        break
      case 'thisyear':
        setFromDate(startOfYear(today).toISOString().split('T')[0])
        setToDate(today.toISOString().split('T')[0])
        break
    }
  }

  const handleDownloadCSV = () => {
    if (!balanceSheet) return
    exportBalanceSheetToCSV(
      balanceSheet,
      `balance-sheet-${fromDate}-to-${toDate}.csv`
    )
  }

  const handleDownloadPDF = () => {
    if (!balanceSheet) return
    exportBalanceSheetToPDF(
      balanceSheet,
      `balance-sheet-${fromDate}-to-${toDate}.pdf`
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Reports</h2>
          <p className="text-gray-600">View and export financial reports</p>
        </div>

        <Tabs defaultValue="balance-sheet" className="space-y-4">
          <TabsList>
            <TabsTrigger value="balance-sheet">Balance Sheet</TabsTrigger>
            <TabsTrigger value="top-products">Top Products</TabsTrigger>
          </TabsList>

          <TabsContent value="balance-sheet" className="space-y-4">
            {/* Date Range Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date Range</CardTitle>
                <CardDescription>
                  Choose a preset or select custom dates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quick Presets</Label>
                    <Select
                      value={datePreset}
                      onValueChange={(v) => applyPreset(v as DatePreset)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="last7days">Last 7 Days</SelectItem>
                        <SelectItem value="thismonth">This Month</SelectItem>
                        <SelectItem value="lastmonth">Last Month</SelectItem>
                        <SelectItem value="thisquarter">This Quarter</SelectItem>
                        <SelectItem value="thisyear">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="from-date">From Date</Label>
                      <Input
                        id="from-date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setFromDate(e.target.value)
                          setDatePreset('today') // Reset preset
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="to-date">To Date</Label>
                      <Input
                        id="to-date"
                        type="date"
                        value={toDate}
                        onChange={(e) => {
                          setToDate(e.target.value)
                          setDatePreset('today') // Reset preset
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            {balanceSheet && (
              <>
                <div className="grid gap-6 md:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(balanceSheet.totalRevenue)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Cost
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(balanceSheet.totalCost)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Total Profit
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(balanceSheet.totalProfit)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">
                        Profit Margin
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {balanceSheet.profitMargin.toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Preview Table */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Balance Sheet Preview</CardTitle>
                        <CardDescription>
                          Daily breakdown of revenue, cost, and profit
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleDownloadCSV} variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Download CSV
                        </Button>
                        <Button onClick={handleDownloadPDF}>
                          <FileText className="mr-2 h-4 w-4" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-700">
                              Date
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              Revenue
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              Cost
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              Profit
                            </th>
                            <th className="px-4 py-3 text-right font-medium text-gray-700">
                              Sales Count
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {balanceSheet.lineItems.map((item) => (
                            <tr key={item.date} className="hover:bg-gray-50">
                              <td className="px-4 py-3">{formatDate(item.date)}</td>
                              <td className="px-4 py-3 text-right text-green-600 font-medium">
                                {formatCurrency(item.revenue)}
                              </td>
                              <td className="px-4 py-3 text-right text-red-600">
                                {formatCurrency(item.cost)}
                              </td>
                              <td className="px-4 py-3 text-right text-primary font-medium">
                                {formatCurrency(item.profit)}
                              </td>
                              <td className="px-4 py-3 text-right">{item.salesCount}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-50 font-bold">
                          <tr>
                            <td className="px-4 py-3">TOTAL</td>
                            <td className="px-4 py-3 text-right text-green-600">
                              {formatCurrency(balanceSheet.totalRevenue)}
                            </td>
                            <td className="px-4 py-3 text-right text-red-600">
                              {formatCurrency(balanceSheet.totalCost)}
                            </td>
                            <td className="px-4 py-3 text-right text-primary">
                              {formatCurrency(balanceSheet.totalProfit)}
                            </td>
                            <td className="px-4 py-3 text-right">
                              {balanceSheet.lineItems.reduce((sum, item) => sum + item.salesCount, 0)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {isLoading && (
              <div className="text-center py-12">Loading balance sheet...</div>
            )}
          </TabsContent>

          <TabsContent value="top-products">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Selling Products</CardTitle>
                <CardDescription>
                  Best performing products by revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topProducts && topProducts.length > 0 ? (
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div
                        key={product.productId}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{product.productName}</h4>
                          <p className="text-sm text-gray-600">
                            {product.totalQuantity} units sold • {product.salesCount} sales
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {formatCurrency(product.totalRevenue)}
                          </p>
                          <p className="text-xs text-gray-600">Total revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    No sales data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}