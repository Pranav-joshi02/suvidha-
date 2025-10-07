'use client'

import { useParams, useRouter } from 'next/navigation'
import { useSale } from '@/hooks/use-sales'
import { Button } from '@/components/ui/button'
import { Printer, Download, ArrowLeft } from 'lucide-react'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { jsPDF } from 'jspdf'

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const saleId = params.saleId as string
  
  const { data: sale, isLoading } = useSale(saleId)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    if (!sale) return

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(20)
    doc.text('POS System', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('123 Main Street, City, State 12345', 105, 28, { align: 'center' })
    doc.text('Phone: (123) 456-7890', 105, 35, { align: 'center' })
    
    // Receipt Info
    doc.setFontSize(10)
    doc.text(`Receipt #: ${sale.id}`, 20, 50)
    doc.text(`Date: ${formatDateTime(sale.createdAt)}`, 20, 57)
    doc.text(`Cashier: ${sale.soldBy.name}`, 20, 64)
    
    // Line
    doc.line(20, 70, 190, 70)
    
    // Items Header
    doc.setFontSize(10)
    doc.text('Item', 20, 78)
    doc.text('Qty', 120, 78)
    doc.text('Price', 145, 78)
    doc.text('Total', 170, 78, { align: 'right' })
    
    doc.line(20, 80, 190, 80)
    
    // Items
    let yPos = 88
    sale.items.forEach((item) => {
      doc.text(item.product.name.substring(0, 30), 20, yPos)
      doc.text(item.quantity.toString(), 120, yPos)
      doc.text(formatCurrency(item.unitPrice), 145, yPos)
      doc.text(formatCurrency(item.totalPrice), 190, yPos, { align: 'right' })
      yPos += 7
    })
    
    // Totals
    doc.line(20, yPos, 190, yPos)
    yPos += 8
    
    doc.text('Subtotal:', 120, yPos)
    doc.text(formatCurrency(sale.subtotal), 190, yPos, { align: 'right' })
    yPos += 7
    
    if (sale.discount > 0) {
      doc.text('Discount:', 120, yPos)
      doc.text(`-${formatCurrency(sale.discount)}`, 190, yPos, { align: 'right' })
      yPos += 7
    }
    
    if (sale.tax > 0) {
      doc.text('Tax:', 120, yPos)
      doc.text(formatCurrency(sale.tax), 190, yPos, { align: 'right' })
      yPos += 7
    }
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('TOTAL:', 120, yPos)
    doc.text(formatCurrency(sale.total), 190, yPos, { align: 'right' })
    
    // Footer
    yPos += 15
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Thank you for your purchase!', 105, yPos, { align: 'center' })
    
    // Save
    doc.save(`receipt-${sale.id}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading receipt...</p>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Receipt not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Action Buttons - Hidden in print */}
      <div className="max-w-2xl mx-auto px-4 mb-6 no-print flex gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
        <Button variant="outline" onClick={handleDownloadPDF}>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Receipt - Print Area */}
      <div className="print-area max-w-2xl mx-auto bg-white shadow-lg">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">POS System</h1>
            <p className="text-sm text-gray-600">123 Main Street, City, State 12345</p>
            <p className="text-sm text-gray-600">Phone: (123) 456-7890</p>
            <p className="text-sm text-gray-600">Email: contact@possystem.com</p>
          </div>

          {/* Receipt Info */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-sm text-gray-600">Receipt Number:</p>
              <p className="font-semibold">{sale.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date:</p>
              <p className="font-semibold">{formatDateTime(sale.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cashier:</p>
              <p className="font-semibold">{sale.soldBy.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method:</p>
              <p className="font-semibold">Cash</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sale.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3">
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">{item.product.category.name}</p>
                    </td>
                    <td className="text-center py-3">{item.quantity}</td>
                    <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
                    <td className="text-right py-3 font-medium">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="border-t-2 border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(sale.subtotal)}</span>
            </div>
            
            {sale.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(sale.discount)}
                </span>
              </div>
            )}
            
            {sale.tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(sale.tax)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-300">
              <span>TOTAL:</span>
              <span className="text-primary">{formatCurrency(sale.total)}</span>
            </div>

            {sale.totalProfit > 0 && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Profit:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(sale.totalProfit)}
                </span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-300 text-center">
            <p className="text-lg font-semibold mb-2">Thank you for your purchase!</p>
            <p className="text-sm text-gray-600">Please come again</p>
            <div className="mt-4">
              <p className="text-xs text-gray-500">
                This is a computer-generated receipt. No signature required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}