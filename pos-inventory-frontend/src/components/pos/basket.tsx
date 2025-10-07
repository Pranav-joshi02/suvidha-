'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, calculateProfit } from '@/lib/utils'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { Product } from '@/types'

interface BasketItem {
  product: Product
  quantity: number
}

interface BasketProps {
  items: BasketItem[]
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onClearBasket: () => void
  onCheckout: () => void
}

export function Basket({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearBasket, 
  onCheckout 
}: BasketProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + (item.product.sellPrice * item.quantity), 
    0
  )
  
  const totalCost = items.reduce(
    (sum, item) => sum + (item.product.costPrice * item.quantity), 
    0
  )
  
  const totalProfit = totalAmount - totalCost
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Basket ({itemCount} items)
          </span>
          {items.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearBasket}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="text-gray-500">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Your basket is empty</p>
              <p className="text-sm">Search and add products to get started</p>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 space-y-3 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div 
                  key={item.product.id} 
                  className="p-3 bg-gray-50 rounded-lg space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatCurrency(item.product.sellPrice)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        max={item.product.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const qty = Math.max(1, parseInt(e.target.value) || 1)
                          onUpdateQuantity(item.product.id, qty)
                        }}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(item.product.sellPrice * item.quantity)}
                      </div>
                      <div className="text-xs text-green-600">
                        Profit: {formatCurrency(calculateProfit(
                          item.product.sellPrice, 
                          item.product.costPrice, 
                          item.quantity
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Total Profit:</span>
                <span>{formatCurrency(totalProfit)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Button 
              onClick={onCheckout}
              className="w-full mt-4 h-12 text-lg bg-green-600 hover:bg-green-700"
              disabled={items.length === 0}
            >
              Complete Sale
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}