'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { useCategories, useCreateProduct, useUpdateProduct } from '@/hooks/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  costPrice: z.number().min(0, 'Cost price must be positive'),
  sellPrice: z.number().min(0, 'Sell price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  lowStockThreshold: z.number().int().min(0, 'Threshold must be positive').optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  product?: Product
  mode: 'create' | 'edit'
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter()
  const { data: categories } = useCategories()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      sku: product.sku || '',
      categoryId: product.categoryId,
      costPrice: product.costPrice,
      sellPrice: product.sellPrice,
      stock: product.stock,
      lowStockThreshold: product.lowStockThreshold || 10,
    } : {
      costPrice: 0,
      sellPrice: 0,
      stock: 0,
      lowStockThreshold: 10,
    }
  })

  const categoryOptions = (categories || []).map(cat => ({
    value: cat.id,
    label: cat.name,
  }))

  const selectedCategoryId = watch('categoryId')
  const costPrice = watch('costPrice')
  const sellPrice = watch('sellPrice')

  const profitMargin = sellPrice > 0 ? ((sellPrice - costPrice) / sellPrice * 100) : 0

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (mode === 'create') {
        await createProductMutation.mutateAsync(data)
        toast.success('Product created successfully!')
      } else if (product) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          data,
        })
        toast.success('Product updated successfully!')
      }
      router.push('/admin/products')
    } catch (error) {
      toast.error(`Failed to ${mode} product`)
    }
  }

  const isLoading = createProductMutation.isPending || updateProductMutation.isPending

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'create' ? 'Add New Product' : 'Edit Product'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Optional)</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Enter SKU"
              />
              {errors.sku && (
                <p className="text-sm text-red-500">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <SearchableSelect
              options={categoryOptions}
              value={selectedCategoryId}
              onSelect={(option) => setValue('categoryId', option.value)}
              placeholder="Select a category"
            />
            {errors.categoryId && (
              <p className="text-sm text-red-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                {...register('costPrice', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.costPrice && (
                <p className="text-sm text-red-500">{errors.costPrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellPrice">Sell Price *</Label>
              <Input
                id="sellPrice"
                type="number"
                step="0.01"
                min="0"
                {...register('sellPrice', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.sellPrice && (
                <p className="text-sm text-red-500">{errors.sellPrice.message}</p>
              )}
            </div>
          </div>

          {/* Profit Margin Display */}
          {(costPrice > 0 || sellPrice > 0) && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit per unit:</span>
                <span className="font-medium">
                  {formatCurrency(sellPrice - costPrice)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profit margin:</span>
                <span className={`font-medium ${profitMargin >= 20 ? 'text-green-600' : profitMargin >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {profitMargin.toFixed(2)}%
                </span>
              </div>
            </div>
          )}

          {/* Inventory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                {...register('stock', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-sm text-red-500">{errors.stock.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                {...register('lowStockThreshold', { valueAsNumber: true })}
                placeholder="10"
              />
              {errors.lowStockThreshold && (
                <p className="text-sm text-red-500">{errors.lowStockThreshold.message}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading 
                ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                : (mode === 'create' ? 'Create Product' : 'Update Product')
              }
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}