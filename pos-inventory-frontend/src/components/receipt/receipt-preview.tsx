'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import { generateReceiptPDF } from '@/lib/pdf-generator'
import { Sale, Settings } from '@/types'
import { Printer, Download } from 'lucide-react'

interface ReceiptPreviewProps {
  sale: Sale
  settings?: Settings
}

export function ReceiptPreview({ sale, settings }: ReceiptPreviewProps) {
  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    generateReceiptPDF({ sale, settings })
  }

  const taxRate = settings?.taxRate || 0
  const taxAmount = taxRate > 0 ? sale.totalAmount * (taxRate / 100) : 0

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Action Buttons */}
      <div className="flex gap-4 no-print">
        <Button onClick={handlePrint} className="flex-1">
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline" className="flex-1">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Receipt */}
      <Card className="receipt-container">
        <CardContent className="p-6 font-mono text-sm">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-lg font-bold">
              {settings?.shopName || 'POS Shop'}
            </h1>
            {settings?.shopAddress && (
              <p className="text-xs text-gray-600 mt-1">
                {settings.shopAddress}
              </p>
            )}
          </div>

          <div className="border-t border-b border-dashed py-3 mb-4">
            <div className="flex justify-between text-xs">
              <span>Receipt #:</span>
              <span>{sale.id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Date:</span>
              <span>{formatDate(sale.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Cashier:</span>
              <span>{sale.soldBy.name}</span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-4">
            <h3 className="font-bold mb-2">ITEMS</h3>
            {sale.items.map((item, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <span className="font-medium">{item.product.name}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{item.quantity} x {formatCurrency(item.unitPrice)}</span>
                  <span>{formatCurrency(item.totalPrice)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed pt-3">
            {/* Subtotal */}
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>{formatCurrency(sale.totalAmount - taxAmount)}</span>
            </div>

            {/* Tax */}
            {taxAmount > 0 && (
              <div className="flex justify-between mb-1">
                <span>Tax ({taxRate}%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>TOTAL:</span>
              <span>{formatCurrency(sale.totalAmount)}</span>
            </div>
          </div>

          {/* Profit (optional - for internal use) */}
          {sale.totalProfit > 0 && (
            <div className="border-t border-dashed pt-3 mt-3 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Profit:</span>
                <span>{formatCurrency(sale.totalProfit)}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6 text-xs text-gray-600">
            <p>Thank you for your business!</p>
            <p>Please keep this receipt</p>
            <p className="mt-2">Sale ID: {sale.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}