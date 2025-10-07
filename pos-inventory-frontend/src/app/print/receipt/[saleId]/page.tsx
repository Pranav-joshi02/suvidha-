'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ReceiptPreview } from '@/components/receipt/receipt-preview'
import { useSale, useSettings } from '@/hooks/api'
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function ReceiptPage() {
  const params = useParams()
  const router = useRouter()
  const saleId = params.saleId as string

  const { data: sale, isLoading: saleLoading, error: saleError } = useSale(saleId)
  const { data: settings } = useSettings()

  if (saleLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading receipt...</p>
        </div>
      </div>
    )
  }

  if (saleError || !sale) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Receipt Not Found</h1>
          <p className="text-gray-600">
            The requested receipt could not be found or has been deleted.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 no-print">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Sale Receipt</h1>
          <p className="text-gray-600">
            Receipt for sale #{sale.id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Receipt */}
        <ReceiptPreview sale={sale} settings={settings} />
      </div>
    </div>
  )
}