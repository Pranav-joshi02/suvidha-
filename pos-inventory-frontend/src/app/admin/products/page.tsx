'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { ProductTable } from '@/components/products/product-table'

export default function ProductsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">
            Manage your product inventory and pricing
          </p>
        </div>

        <ProductTable />
      </div>
    </AdminLayout>
  )
}