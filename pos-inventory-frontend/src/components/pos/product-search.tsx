'use client'

import { useState, useEffect } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useProducts } from '@/hooks/api'
import { useUIStore } from '@/stores/ui-store'
import { formatCurrency } from '@/lib/utils'
import { Plus, Package } from 'lucide-react'
import { Product } from '@/types'

interface ProductSearchProps {
  onAddToBasket: (product: Product, quantity: number) => void
}

export function ProductSearch({ onAddToBasket }: ProductSearchProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  const { data: products, isLoading } = useProducts({ 
    search: searchTerm,
    limit: 50 
  })

  const productOptions = (products || []).map(product => ({
    value: product.id,
    label: `${product.name} - ${formatCurrency(product.sellPrice)} (Stock: ${product.stock})`,
    data: product,
  }))

  const handleProductSelect = (option: { value: string; label: string; data: Product }) => {
    setSelectedProduct(option.data)
    setQuantity(1)
  }

  const handleAddToBasket = () => {
    if (selectedProduct && quantity > 0) {
      if (quantity > selectedProduct.stock) {
        alert(`Only ${selectedProduct.stock} items available in stock`)
        return
      }
      onAddToBasket(selectedProduct, quantity)
      setSelectedProduct(null)
      setQuantity(1)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && selectedProduct) {
      handleAddToBasket()
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="product-search">Search Product</Label>
        <SearchableSelect
          options={productOptions}
          value={selectedProduct?.id}
          onSelect={handleProductSelect}
          placeholder="Search for products..."
          searchPlaceholder="Type to search products..."
          loading={isLoading}
          className="mt-1"
        />
      </div>

      {selectedProduct && (
        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{selectedProduct.name}</h3>
              <p className="text-sm text-gray-500">
                Price: {formatCurrency(selectedProduct.sellPrice)} • 
                Stock: {selectedProduct.stock} • 
                Category: {selectedProduct.category}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={selectedProduct.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                onKeyPress={handleKeyPress}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Total Price</Label>
              <div className="mt-1 h-10 px-3 py-2 bg-gray-100 rounded-md flex items-center text-sm font-medium">
                {formatCurrency(selectedProduct.sellPrice * quantity)}
              </div>
            </div>
          </div>

          <Button 
            onClick={handleAddToBasket}
            className="w-full"
            disabled={quantity <= 0 || quantity > selectedProduct.stock}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add to Basket
          </Button>
        </div>
      )}
    </div>
  )
}