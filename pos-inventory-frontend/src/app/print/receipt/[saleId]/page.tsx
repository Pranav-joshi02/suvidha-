'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ReceiptPreview } from '@/components/receipt/ReceiptPreview'
import { useAuth } from '@/contexts/AuthContext'

interface PrintReceiptPageProps {
  params: {
    saleId: string
  }
}

export default function PrintReceiptPage({ params }: PrintReceiptPageProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <ReceiptPreview saleId={params.saleId} />
}