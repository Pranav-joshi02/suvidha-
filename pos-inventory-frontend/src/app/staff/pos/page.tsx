'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { StaffLayout } from '@/components/layouts/staff-layout'
import { ProductSearch } from '@/components/pos/product-search'
import { Basket } from '@/components/pos/basket'
import { useCreateSale } from '@/hooks/api'
import { authUtils } from '@/lib/auth'
import { toast } from 'sonner'
import { Product } from '@/types'

interface BasketItem {
  product: Product
  quantity: number
}

export default function StaffPOSPage() {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([])
  const createSaleMutation = useCreateSale()
  const router = useRouter()
  const user = authUtils.getUser()

  const handleAddToBasket = (product: Product, quantity: number) => {
    setBasketItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      
      if (existingIndex >= 0) {
        const newItems = [...prev]
        newItems[existingIndex].quantity += quantity
        return newItems
      } else {
        return [...prev, { product, quantity }]
      }
    })
    toast.success(`Added ${product.name} to basket`)
  }

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId)
      return
    }
    
    setBasketItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const handleRemoveItem = (productId: string) => {
    setBasketItems(prev => prev.filter(item => item.product.id !== productId))
    toast.success('Item removed from basket')
  }

  const handleClearBasket = () => {
    setBasketItems([])
    toast.success('Basket cleared')
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('User not authenticated')
      return
    }

    try {
      const saleData = {
        items: basketItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        }))
      }

      const sale = await createSaleMutation.mutateAsync(saleData)
      
      toast.success('Sale completed successfully!')
      setBasketItems([])
      
      // Redirect to receipt page
      router.push(`/print/receipt/${sale.id}`)
    } catch (error) {
      toast.error('Failed to complete sale')
    }
  }

  return (
    <StaffLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
          <p className="text-gray-600 mt-1">
            Process sales transactions quickly and efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Product Search */}
          <div className="space-y-6">
            <ProductSearch onAddToBasket={handleAddToBasket} />
          </div>

          {/* Basket */}
          <div>
            <Basket
              items={basketItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearBasket={handleClearBasket}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}