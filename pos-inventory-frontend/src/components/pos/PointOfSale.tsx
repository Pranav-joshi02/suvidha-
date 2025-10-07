'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Trash2,
  Package,
  DollarSign
} from 'lucide-react'
import { ProductWithCategory, CartItem, CreateSaleRequest } from '@/types'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export function PointOfSale() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null)
  const [quantity, setQuantity] = useState(1)
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.getProducts(),
  })

  const createSaleMutation = useMutation({
    mutationFn: (data: CreateSaleRequest) => apiClient.createSale(data),
    onSuccess: () => {
      setCart([])
      setSearchTerm('')
      setSelectedProduct(null)
      setQuantity(1)
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['kpis'] })
      toast.success('Sale completed successfully!')
    },
    onError: (error) => {
      toast.error('Failed to complete sale')
      console.error('Sale error:', error)
    },
  })

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = () => {
    if (!selectedProduct) return

    const existingItem = cart.find(item => item.product.id === selectedProduct.id)
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === selectedProduct.id
          ? {
              ...item,
              quantity: item.quantity + quantity,
              totalPrice: (item.quantity + quantity) * selectedProduct.sellPrice,
              totalCost: (item.quantity + quantity) * selectedProduct.costPrice,
              profit: ((item.quantity + quantity) * selectedProduct.sellPrice) - ((item.quantity + quantity) * selectedProduct.costPrice),
            }
          : item
      ))
    } else {
      const newItem: CartItem = {
        product: selectedProduct,
        quantity,
        unitPrice: selectedProduct.sellPrice,
        totalPrice: quantity * selectedProduct.sellPrice,
        unitCost: selectedProduct.costPrice,
        totalCost: quantity * selectedProduct.costPrice,
        profit: (quantity * selectedProduct.sellPrice) - (quantity * selectedProduct.costPrice),
      }
      setCart([...cart, newItem])
    }

    setQuantity(1)
    setSelectedProduct(null)
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity: newQuantity,
            totalPrice: newQuantity * item.unitPrice,
            totalCost: newQuantity * item.unitCost,
            profit: (newQuantity * item.unitPrice) - (newQuantity * item.unitCost),
          }
        : item
    ))
  }

  const getCartTotals = () => {
    const totalAmount = cart.reduce((sum, item) => sum + item.totalPrice, 0)
    const totalCost = cart.reduce((sum, item) => sum + item.totalCost, 0)
    const totalProfit = cart.reduce((sum, item) => sum + item.profit, 0)
    return { totalAmount, totalCost, totalProfit }
  }

  const handleCompleteSale = () => {
    if (cart.length === 0 || !user) return

    const saleData: CreateSaleRequest = {
      items: cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      soldById: user.id,
    }

    createSaleMutation.mutate(saleData)
  }

  const totals = getCartTotals()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Product Search and Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">
                        {product.sku && `SKU: ${product.sku}`} • {product.category.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium">${product.sellPrice}</span>
                        <Badge variant={product.stock < 5 ? 'destructive' : 'secondary'}>
                          {product.stock} in stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedProduct && (
            <div className="border-t pt-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button onClick={addToCart} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shopping Cart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Shopping Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2">Your cart is empty</p>
              <p className="text-sm">Search and add products to get started</p>
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        ${item.unitPrice} × {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="font-medium w-16 text-right">
                        ${item.totalPrice.toFixed(2)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${totals.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Cost:</span>
                  <span>${totals.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Profit:</span>
                  <span>${totals.totalProfit.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCompleteSale}
                disabled={createSaleMutation.isPending}
                className="w-full"
                size="lg"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                Complete Sale (${totals.totalAmount.toFixed(2)})
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}