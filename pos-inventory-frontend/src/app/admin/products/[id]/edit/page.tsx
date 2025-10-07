'use client'

import { useParams } from 'next/navigation'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { ProductForm } from '@/components/products/product-form'
import { useProduct } from '@/hooks/api'
import { Loader2 } from 'lucide-react'

export default function EditProductPage() {
  const params = useParams()
  const productId = params.id as string

  const { data: product, isLoading, error } = useProduct(productId)

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading product...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
          <p className="text-gray-600">
            The requested product could not be found or has been deleted.
          </p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-1">
            Update product information and pricing
          </p>
        </div>

        <ProductForm product={product} mode="edit" />
      </div>
    </AdminLayout>
  )
}