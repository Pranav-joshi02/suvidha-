import jsPDF from 'jspdf'
import { Sale, Settings } from '@/types'
import { formatCurrency, formatDate } from './utils'

export interface ReceiptData {
  sale: Sale
  settings?: Settings
}

export function generateReceiptPDF(data: ReceiptData): void {
  const { sale, settings } = data
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 200] // Thermal receipt size
  })

  let yPosition = 10
  const lineHeight = 4
  const pageWidth = 80

  // Helper function to add text
  const addText = (text: string, x: number = pageWidth / 2, align: 'left' | 'center' | 'right' = 'center', fontSize: number = 8) => {
    pdf.setFontSize(fontSize)
    pdf.text(text, x, yPosition, { align })
    yPosition += lineHeight
  }

  // Helper function to add line
  const addLine = () => {
    pdf.line(5, yPosition, pageWidth - 5, yPosition)
    yPosition += lineHeight
  }

  // Shop header
  pdf.setFont('helvetica', 'bold')
  addText(settings?.shopName || 'POS Shop', pageWidth / 2, 'center', 12)
  
  pdf.setFont('helvetica', 'normal')
  if (settings?.shopAddress) {
    addText(settings.shopAddress, pageWidth / 2, 'center', 8)
  }
  
  yPosition += 2
  addLine()

  // Receipt info
  addText(`Receipt #: ${sale.id.slice(-8).toUpperCase()}`, 5, 'left', 8)
  addText(`Date: ${formatDate(sale.createdAt)}`, 5, 'left', 8)
  addText(`Cashier: ${sale.soldBy.name}`, 5, 'left', 8)
  
  yPosition += 2
  addLine()

  // Items header
  pdf.setFont('helvetica', 'bold')
  addText('ITEMS', 5, 'left', 9)
  yPosition += 1

  // Items
  pdf.setFont('helvetica', 'normal')
  sale.items.forEach(item => {
    // Product name
    addText(item.product.name, 5, 'left', 8)
    
    // Quantity x Price = Total
    const qtyPriceText = `${item.quantity} x ${formatCurrency(item.unitPrice)}`
    const totalText = formatCurrency(item.totalPrice)
    
    pdf.text(qtyPriceText, 5, yPosition, { align: 'left' })
    pdf.text(totalText, pageWidth - 5, yPosition, { align: 'right' })
    yPosition += lineHeight
    
    yPosition += 1 // Extra space between items
  })

  addLine()

  // Totals
  pdf.setFont('helvetica', 'bold')
  
  // Subtotal
  pdf.text('SUBTOTAL:', 5, yPosition, { align: 'left' })
  pdf.text(formatCurrency(sale.totalAmount), pageWidth - 5, yPosition, { align: 'right' })
  yPosition += lineHeight

  // Tax (if applicable)
  if (settings?.taxRate && settings.taxRate > 0) {
    const taxAmount = sale.totalAmount * (settings.taxRate / 100)
    pdf.text(`TAX (${settings.taxRate}%):`, 5, yPosition, { align: 'left' })
    pdf.text(formatCurrency(taxAmount), pageWidth - 5, yPosition, { align: 'right' })
    yPosition += lineHeight
  }

  // Total
  pdf.setFontSize(10)
  pdf.text('TOTAL:', 5, yPosition, { align: 'left' })
  pdf.text(formatCurrency(sale.totalAmount), pageWidth - 5, yPosition, { align: 'right' })
  yPosition += lineHeight * 1.5

  addLine()

  // Footer
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(7)
  addText('Thank you for your business!', pageWidth / 2, 'center', 8)
  addText('Please keep this receipt', pageWidth / 2, 'center', 7)
  
  yPosition += 3
  addText(`Sale ID: ${sale.id}`, pageWidth / 2, 'center', 6)

  // Save the PDF
  const fileName = `receipt-${sale.id.slice(-8)}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}

export function generateBalanceSheetPDF(data: any, period: string): void {
  const pdf = new jsPDF()
  
  let yPosition = 20
  const lineHeight = 6
  const pageWidth = 210

  // Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(16)
  pdf.text('Balance Sheet Report', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 1.5

  pdf.setFontSize(12)
  pdf.text(`Period: ${period}`, pageWidth / 2, yPosition, { align: 'center' })
  yPosition += lineHeight * 2

  // Summary section
  pdf.setFontSize(14)
  pdf.text('Financial Summary', 20, yPosition)
  yPosition += lineHeight

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)

  const summaryData = [
    ['Total Revenue:', formatCurrency(data.totalRevenue || 0)],
    ['Total Cost:', formatCurrency(data.totalCost || 0)],
    ['Total Profit:', formatCurrency(data.totalProfit || 0)],
    ['Profit Margin:', `${((data.totalProfit / data.totalRevenue) * 100 || 0).toFixed(2)}%`],
    ['Total Sales:', `${data.salesCount || 0} transactions`],
  ]

  summaryData.forEach(([label, value]) => {
    pdf.text(label, 25, yPosition)
    pdf.text(value, 120, yPosition)
    yPosition += lineHeight
  })

  yPosition += lineHeight

  // Top products section
  if (data.topProducts && data.topProducts.length > 0) {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.text('Top Selling Products', 20, yPosition)
    yPosition += lineHeight

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)

    // Table headers
    pdf.text('Product', 25, yPosition)
    pdf.text('Quantity', 100, yPosition)
    pdf.text('Revenue', 140, yPosition)
    yPosition += lineHeight

    // Draw line under headers
    pdf.line(20, yPosition - 2, 190, yPosition - 2)
    yPosition += 2

    data.topProducts.forEach((item: any) => {
      pdf.text(item.product.name, 25, yPosition)
      pdf.text(item.quantity.toString(), 100, yPosition)
      pdf.text(formatCurrency(item.revenue), 140, yPosition)
      yPosition += lineHeight
    })
  }

  // Footer
  yPosition = 280 // Near bottom of page
  pdf.setFontSize(8)
  pdf.text(`Generated on: ${formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' })

  // Save the PDF
  const fileName = `balance-sheet-${period.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
  pdf.save(fileName)
}