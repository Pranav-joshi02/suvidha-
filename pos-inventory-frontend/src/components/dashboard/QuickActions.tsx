'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  Settings,
  Plus,
  History
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: 'Add Product',
      description: 'Add a new product to inventory',
      icon: Plus,
      onClick: () => router.push('/admin/products/new'),
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'Record Sale',
      description: 'Process a new sale',
      icon: ShoppingCart,
      onClick: () => router.push('/admin/sales'),
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'View Products',
      description: 'Manage product inventory',
      icon: Package,
      onClick: () => router.push('/admin/products'),
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Sales History',
      description: 'View past sales records',
      icon: History,
      onClick: () => router.push('/admin/sales/history'),
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: 'Daily Report',
      description: 'View today\'s performance',
      icon: BarChart3,
      onClick: () => router.push('/admin/reports/daily'),
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
    {
      title: 'Manage Users',
      description: 'Add or remove staff users',
      icon: Users,
      onClick: () => router.push('/admin/settings/users'),
      color: 'bg-pink-500 hover:bg-pink-600',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start space-y-2"
                onClick={action.onClick}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <p className="text-sm text-gray-600 text-left">
                  {action.description}
                </p>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}