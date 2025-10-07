import { parse } from 'papaparse'
import { jsPDF } from 'jspdf'
import { formatCurrency, formatDate } from './utils'
import { BalanceSheetData } from './types'

export function exportToCSV(data: any[], filename: string) {
  // Convert data to CSV format
  const headers = Object.keys(data[0] || {})
  const csvData = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Escape commas and quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        .join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportBalanceSheetToCSV(data: BalanceSheetData, filename: string) {
  const csvData = [
    ['Balance Sheet Report'],
    ['Period', `${data.from} to ${data.to}`],
    [''],
    ['Summary'],
    ['Total Revenue', data.totalRevenue],
    ['Total Cost', data.totalCost],
    ['Total Profit', data.totalProfit],
    ['Profit Margin', `${data.profitMargin.toFixed(2)}%`],
    [''],
    ['Daily Breakdown'],
    ['Date', 'Revenue', 'Cost', 'Profit', 'Sales Count'],
    ...data.lineItems.map((item) => [
      item.date,
      item.revenue,
      item.cost,
      item.profit,
      item.salesCount,
    ]),
  ]

  const csv = csvData.map((row) => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportBalanceSheetToPDF(data: BalanceSheetData, filename: string) {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text('Balance Sheet Report', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text(`Period: ${formatDate(data.from)} to ${formatDate(data.to)}`, 105, 30, {
    align: 'center',
  })

  // Summary Box
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Summary', 20, 45)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  
  let yPos = 55
  const summaryItems = [
    ['Total Revenue:', formatCurrency(data.totalRevenue)],
    ['Total Cost:', formatCurrency(data.totalCost)],
    ['Total Profit:', formatCurrency(data.totalProfit)],
    ['Profit Margin:', `${data.profitMargin.toFixed(2)}%`],
  ]

  summaryItems.forEach(([label, value]) => {
    doc.text(label, 25, yPos)
    doc.text(value, 100, yPos)
    yPos += 7
  })

  // Daily Breakdown
  yPos += 10
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('Daily Breakdown', 20, yPos)
  
  yPos += 10
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  
  // Table headers
  doc.text('Date', 20, yPos)
  doc.text('Revenue', 70, yPos)
  doc.text('Cost', 110, yPos)
  doc.text('Profit', 140, yPos)
  doc.text('Sales', 170, yPos)
  
  yPos += 5
  doc.line(20, yPos, 190, yPos)
  yPos += 5

  // Table rows
  doc.setFont('helvetica', 'normal')
  data.lineItems.forEach((item) => {
    // Check if we need a new page
    if (yPos > 270) {
      doc.addPage()
      yPos = 20
    }

    doc.text(formatDate(item.date), 20, yPos)
    doc.text(formatCurrency(item.revenue), 70, yPos)
    doc.text(formatCurrency(item.cost), 110, yPos)
    doc.text(formatCurrency(item.profit), 140, yPos)
    doc.text(item.salesCount.toString(), 170, yPos)
    yPos += 7
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    )
    doc.text(
      `Generated on ${formatDate(new Date().toISOString())}`,
      105,
      290,
      { align: 'center' }
    )
  }

  doc.save(filename)
}