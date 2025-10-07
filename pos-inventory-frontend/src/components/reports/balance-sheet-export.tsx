'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBalanceSheet } from '@/hooks/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateBalanceSheetPDF } from '@/lib/pdf-generator'
import { exportBalanceSheetToCSV } from '@/lib/csv-exporter'
import { Download, FileText, Calendar } from 'lucide-react'
import { DateRange, ExportPreset } from '@/types'

const exportPresets: ExportPreset[] = [
  {
    label: 'Today',
    value: 'today',
    range: {
      from: new Date(),
      to: new Date(),
    },
  },
  {
    label: 'Last 7 Days',
    value: 'last7days',
    range: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
  },
  {
    label: 'This Month',
    value: 'thismonth',
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
  },
  {
    label: 'Last Month',
    value: 'lastmonth',
    range: {
      from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      to: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
    },
  },
  {
    label: 'This Quarter',
    value: 'thisquarter',
    range: {
      from: new Date(new Date().getFullYear(), Math.floor(new Date().getMonth() / 3) * 3, 1),
      to: new Date(),
    },
  },
  {
    label: 'This Year',
    value: 'thisyear',
    range: {
      from: new Date(new Date().getFullYear(), 0, 1),
      to: new Date(),
    },
  },
]

export function BalanceSheetExport() {
  const [selectedPreset, setSelectedPreset] = useState('thismonth')
  
  const preset = exportPresets.find(p => p.value === selectedPreset)
  const dateRange = preset?.range

  const { data: balanceSheet, isLoading } = useBalanceSheet(
    dateRange ? {
      from: dateRange.from.toISOString().split('T')[0],
      to: dateRange.to.toISOString().split('T')[0],
    } : undefined
  )

  const presetOptions = exportPresets.map(preset => ({
    value: preset.value,
    label: preset.label,
  }))

  const handleDownloadPDF = () => {
    if (balanceSheet && preset) {
      generateBalanceSheetPDF(balanceSheet, preset.label)
    }
  }

  const handleDownloadCSV = () => {
    if (balanceSheet && preset) {
      exportBalanceSheetToCSV(balanceSheet, preset.label)
    }
  }

  return (
    <div className="space-y-6">
      {/* Export Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Balance Sheet Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2">
              <Label>Date Range Preset</Label>
              <SearchableSelect
                options={presetOptions}
                value={selectedPreset}
                onSelect={(option) => setSelectedPreset(option.value)}
                placeholder="Select date range"
              />
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  {dateRange && (
                    `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                  )}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownloadCSV}
                disabled={isLoading || !balanceSheet}
                variant="outline"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                CSV
              </Button>
              <Button
                onClick={handleDownloadPDF}
                disabled={isLoading || !balanceSheet}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      ) : balanceSheet ? (
        <Card>
          <CardHeader>
            <CardTitle>Balance Sheet Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Total Revenue</div>
                <div className="text-2xl font-bold text-blue-900">
                  {formatCurrency(balanceSheet.totalRevenue)}
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-sm text-red-600 font-medium">Total Cost</div>
                <div className="text-2xl font-bold text-red-900">
                  {formatCurrency(balanceSheet.totalCost)}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Total Profit</div>
                <div className="text-2xl font-bold text-green-900">
                  {formatCurrency(balanceSheet.totalProfit)}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Profit Margin</div>
                <div className="text-2xl font-bold text-purple-900">
                  {balanceSheet.profitMargin.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Top Products */}
            {balanceSheet.topProducts && balanceSheet.topProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity Sold</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balanceSheet.topProducts.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {item.product.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.revenue)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-gray-600">Total Sales Transactions</div>
                <div className="text-xl font-semibold">{balanceSheet.salesCount}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Average Sale Value</div>
                <div className="text-xl font-semibold">
                  {balanceSheet.salesCount > 0 
                    ? formatCurrency(balanceSheet.totalRevenue / balanceSheet.salesCount)
                    : formatCurrency(0)
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              No data available for the selected period
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}