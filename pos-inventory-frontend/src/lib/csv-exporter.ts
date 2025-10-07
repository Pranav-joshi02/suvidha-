import Papa from 'papaparse'
import { Sale, ReportData } from '@/types'
import { formatCurrency, formatDate } from './utils'

export function exportSalesToCSV(sales: Sale[], filename?: string): void {
  const csvData = sales.map(sale => ({
    'Sale ID': sale.id,
    'Date': formatDate(sale.createdAt),
    'Cashier': sale.soldBy.name,
    'Items': sale.items.map(item => 
      `${item.product.name} (${item.quantity}x)`
    ).join('; '),
    'Total Amount': sale.totalAmount,
    'Total Cost': sale.totalCost,
    'Total Profit': sale.totalProfit,
    'Items Count': sale.items.length,
  }))

  const csv = Papa.unparse(csvData)
  downloadCSV(csv, filename || `sales-export-${new Date().toISOString().split('T')[0]}.csv`)
}

export function exportBalanceSheetToCSV(data: any, period: string): void {
  const summaryData = [
    ['Metric', 'Value'],
    ['Period', period],
    ['Total Revenue', formatCurrency(data.totalRevenue || 0)],
    ['Total Cost', formatCurrency(data.totalCost || 0)],
    ['Total Profit', formatCurrency(data.totalProfit || 0)],
    ['Profit Margin', `${((data.totalProfit / data.totalRevenue) * 100 || 0).toFixed(2)}%`],
    ['Total Sales', `${data.salesCount || 0}`],
    [''],
    ['Top Products', ''],
    ['Product Name', 'Quantity Sold', 'Revenue'],
  ]

  if (data.topProducts && data.topProducts.length > 0) {
    data.topProducts.forEach((item: any) => {
      summaryData.push([
        item.product.name,
        item.quantity.toString(),
        formatCurrency(item.revenue)
      ])
    })
  }

  const csv = Papa.unparse(summaryData)
  const filename = `balance-sheet-${period.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename)
}

export function exportReportsToCSV(reports: ReportData[], type: 'daily' | 'monthly', filename?: string): void {
  const csvData = reports.map(report => ({
    'Date': report.date,
    'Revenue': report.revenue,
    'Cost': report.cost,
    'Profit': report.profit,
    'Sales Count': report.salesCount,
    'Profit Margin': report.revenue > 0 ? `${((report.profit / report.revenue) * 100).toFixed(2)}%` : '0%',
  }))

  const csv = Papa.unparse(csvData)
  const defaultFilename = `${type}-reports-${new Date().toISOString().split('T')[0]}.csv`
  downloadCSV(csv, filename || defaultFilename)
}

function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}