'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useProducts, useCategories } from '@/hooks/api'
import { formatCurrency } from '@/lib/utils'
import { 
  Search, 
  Plus, 
  Edit, 
  AlertTriangle, 
  Package,
  Filter,
  X
} from 'lucide-react'
import { Product } from '@/types'

interface ProductTableProps {
  onEdit?: (product: Product) => void
}

export function ProductTable({ onEdit }: ProductTableProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showLowStock, setShowLowStock] = useState(false)

  const { data: products, isLoading } = useProducts({
    search,
    category: selectedCategory,
    lowStock: showLowStock,
  })

  const { data: categories } = useCategories()

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...(categories || []).map(cat => ({
      value: cat.id,
      label: cat.name,
    }))
  ]

  const getStockStatus = (product: Product) => {
    const threshold = product.lowStockThreshold || 10
    if (product.stock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const }
    } else if (product.stock <= threshold) {
      return { label: 'Low Stock', variant: 'secondary' as const }
    }
    return { label: 'In Stock', variant: 'default' as const }
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setShowLowStock(false)
  }

  const hasActiveFilters = search || selectedCategory || showLowStock

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Products ({products?.length || 0})
          </CardTitle>
          <Link href="/admin/products/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <SearchableSelect
            options={categoryOptions}
            value={selectedCategory}
            onSelect={(option) => setSelectedCategory(option.value)}
            placeholder="Select category"
            className="w-full sm:w-48"
          />

          <Button
            variant={showLowStock ? 'default' : 'outline'}
            onClick={() => setShowLowStock(!showLowStock)}
            className="w-full sm:w-auto"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Low Stock
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {products && products.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Cost Price</TableHead>
                <TableHead>Sell Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product)
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{product.name}</div>
                        {product.sku && (
                          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{formatCurrency(product.costPrice)}</TableCell>
                    <TableCell>{formatCurrency(product.sellPrice)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{product.stock}</span>
                        {product.stock <= (product.lowStockThreshold || 10) && (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {hasActiveFilters ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {hasActiveFilters 
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first product'
              }
            </p>
            {!hasActiveFilters && (
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}