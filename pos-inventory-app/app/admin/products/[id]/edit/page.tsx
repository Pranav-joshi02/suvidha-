'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useProduct, useUpdateProduct } from '@/hooks/use-products'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  costPrice: z.number().min(0, 'Cost price must be positive'),
  sellPrice: z.number().min(0, 'Sell price must be positive'),
  stock: z.number().int().min(0, 'Stock must be a positive integer'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
})

type ProductForm = z.infer<typeof productSchema>

export default function EditProductPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const productId = params.id as string
  
  const { data: product, isLoading } = useProduct(productId)
  const updateProduct = useUpdateProduct(productId)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  })

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku || '',
        categoryId: product.categoryId,
        costPrice: product.costPrice,
        sellPrice: product.sellPrice,
        stock: product.stock,
        status: product.status,
      })
    }
  }, [product, reset])

  const onSubmit = async (data: ProductForm) => {
    try {
      await updateProduct.mutateAsync(data)
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      })
      router.push('/admin/products')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p>Loading product...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Edit Product</h2>
            <p className="text-gray-600">Update product information</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Modify the product details below. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" {...register('name')} />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Optional)</Label>
                  <Input id="sku" {...register('sku')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Category *</Label>
                <Select
                  onValueChange={(value) => setValue('categoryId', value)}
                  value={watch('categoryId')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cat-1">Electronics</SelectItem>
                    <SelectItem value="cat-2">Clothing</SelectItem>
                    <SelectItem value="cat-3">Food & Beverage</SelectItem>
                    <SelectItem value="cat-4">Home & Garden</SelectItem>
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price *</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    {...register('costPrice', { valueAsNumber: true })}
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
                    {...register('sellPrice', { valueAsNumber: true })}
                  />
                  {errors.sellPrice && (
                    <p className="text-sm text-red-500">{errors.sellPrice.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-500">{errors.stock.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    onValueChange={(value) => setValue('status', value as any)}
                    value={watch('status')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-4">
                <Link href="/admin/products">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={updateProduct.isPending}>
                  {updateProduct.isPending ? 'Updating...' : 'Update Product'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}