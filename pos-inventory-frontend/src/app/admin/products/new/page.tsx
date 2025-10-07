'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { ProductForm } from '@/components/products/product-form'

export default function NewProductPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Create a new product in your inventory
          </p>
        </div>

        <ProductForm mode="create" />
      </div>
    </AdminLayout>
  )
}