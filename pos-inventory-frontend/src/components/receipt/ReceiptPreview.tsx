'use client'

import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { 
  Printer, 
  Download, 
  ArrowLeft,
  Store,
  Calendar,
  User,
  Package
} from 'lucide-react'
import { SaleWithDetails } from '@/types'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { jsPDF } from 'jspdf'

interface ReceiptPreviewProps {
  saleId: string
}

export function ReceiptPreview({ saleId }: ReceiptPreviewProps) {
  const router = useRouter()

  const { data: sale, isLoading } = useQuery({
    queryKey: ['sale', saleId],
    queryFn: () => apiClient.getSales({ page: 1, limit: 1 }).then(data => 
      data.sales.find(s => s.id === saleId)
    ),
  })

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    if (!sale) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = 20

    // Shop header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('My Shop', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('123 Main St, City, State 12345', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 10

    doc.text('Phone: (555) 123-4567', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Receipt details
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('RECEIPT', pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Receipt #: ${sale.id.slice(-8)}`, margin, yPosition)
    yPosition += 5

    const saleDate = new Date(sale.createdAt)
    doc.text(`Date: ${saleDate.toLocaleDateString()} ${saleDate.toLocaleTimeString()}`, margin, yPosition)
    yPosition += 5

    doc.text(`Cashier: ${sale.soldBy.name}`, margin, yPosition)
    yPosition += 15

    // Items
    doc.setFont('helvetica', 'bold')
    doc.text('Items:', margin, yPosition)
    yPosition += 10

    doc.setFont('helvetica', 'normal')
    sale.saleItems.forEach((item) => {
      doc.text(`${item.product.name}`, margin, yPosition)
      doc.text(`${item.quantity} x $${item.unitPrice.toFixed(2)}`, pageWidth - margin - 50, yPosition)
      yPosition += 5
    })

    yPosition += 10

    // Totals
    doc.setFont('helvetica', 'bold')
    doc.text(`Subtotal: $${sale.totalAmount.toFixed(2)}`, pageWidth - margin - 50, yPosition)
    yPosition += 5

    doc.text(`Total: $${sale.totalAmount.toFixed(2)}`, pageWidth - margin - 50, yPosition)
    yPosition += 20

    // Footer
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text('Thank you for your business!', pageWidth / 2, yPosition, { align: 'center' })

    doc.save(`receipt-${sale.id.slice(-8)}.pdf`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!sale) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sale Not Found</h1>
          <p className="text-gray-600 mb-4">The requested sale could not be found.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Print controls - hidden when printing */}
        <div className="mb-6 print:hidden">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex space-x-4">
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Receipt */}
        <Card className="print:shadow-none print:border-0">
          <CardContent className="p-8">
            {/* Shop Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-2">
                <Store className="h-8 w-8 text-blue-600 mr-2" />
                <h1 className="text-2xl font-bold">My Shop</h1>
              </div>
              <p className="text-gray-600">123 Main St, City, State 12345</p>
              <p className="text-gray-600">Phone: (555) 123-4567</p>
            </div>

            <Separator className="my-6" />

            {/* Receipt Details */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-center mb-4">RECEIPT</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Receipt #:</strong> #{sale.id.slice(-8)}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end mb-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(sale.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <User className="h-4 w-4 mr-1" />
                    <span>{sale.soldBy.name}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Items */}
            <div className="mb-6">
              <h3 className="font-bold mb-4">Items:</h3>
              <div className="space-y-3">
                {sale.saleItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="font-medium">{item.product.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {item.product.sku && `SKU: ${item.product.sku}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        = ${item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${sale.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Total Cost:</span>
                <span>${sale.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Profit:</span>
                <span>${sale.totalProfit.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${sale.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="text-center text-gray-600">
              <p className="text-sm">Thank you for your business!</p>
              <p className="text-xs mt-2">
                Receipt generated on {new Date().toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}