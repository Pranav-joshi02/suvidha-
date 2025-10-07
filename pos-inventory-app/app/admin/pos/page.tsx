'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useProducts } from '@/hooks/use-products'
import { useCreateSale } from '@/hooks/use-sales'
import { useAuth } from '@/hooks/use-auth'
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/types'

interface CartItem {
  product: Product
  quantity: number
}

export default function POSPage() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  
  const { data: productsData } = useProducts({ search, limit: 20 })
  const createSale = useCreateSale()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.product.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(
          cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        )
      } else {
        toast({
          title: 'Out of stock',
          description: `Only ${product.stock} items available`,
          variant: 'destructive',
        })
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { product, quantity: 1 }])
      } else {
        toast({
          title: 'Out of stock',
          description: 'This product is out of stock',
          variant: 'destructive',
        })
      }
    }
  }

  const updateQuantity = (productId: string, change: number) => {
    const item = cart.find((item) => item.product.id === productId)
    if (!item) return

    const newQuantity = item.quantity + change

    if (newQuantity <= 0) {
      removeFromCart(productId)
    } else if (newQuantity <= item.product.stock) {
      setCart(
        cart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      )
    } else {
      toast({
        title: 'Out of stock',
        description: `Only ${item.product.stock} items available`,
        variant: 'destructive',
      })
    }
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId))
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.sellPrice * item.quantity,
    0
  )
  const totalDiscount = discount
  const total = subtotal - totalDiscount

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: 'Cart is empty',
        description: 'Please add items to cart before checkout',
        variant: 'destructive',
      })
      return
    }

    if (!user) {
      toast({
        title: 'Error',
        description: 'User not found',
        variant: 'destructive',
      })
      return
    }

    try {
      const sale = await createSale.mutateAsync({
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
        soldById: user.id,
        discount: totalDiscount,
      })

      toast({
        title: 'Sale completed',
        description: 'Sale has been recorded successfully',
      })

      // Redirect to receipt page
      router.push(`/print/receipt/${sale.id}`)
      
      // Clear cart
      setCart([])
      setDiscount(0)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete sale',
        variant: 'destructive',
      })
    }
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Point of Sale</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search products by name or SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {productsData?.data.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                    <ShoppingCart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-gray-600 truncate">{product.category.name}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="font-bold text-primary">{formatCurrency(product.sellPrice)}</p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        product.stock > 10
                          ? 'bg-green-100 text-green-700'
                          : product.stock > 0
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {productsData?.data.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {search ? 'No products found' : 'Start typing to search products'}
            </div>
          )}
        </div>

        {/* Cart Section */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Current Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart Items */}
              <div className="max-h-96 overflow-auto space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">
                          {formatCurrency(item.product.sellPrice)} each
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              {cart.length > 0 && (
                <>
                  <div className="space-y-2 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <Input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-24 h-7 text-right"
                        step="0.01"
                      />
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={createSale.isPending}
                  >
                    {createSale.isPending ? 'Processing...' : 'Complete Sale'}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}