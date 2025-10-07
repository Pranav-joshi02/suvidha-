'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Users,
  FileText
} from 'lucide-react'

export function QuickActions() {
  const actions = [
    {
      title: 'Record Sale',
      description: 'Process a new sale transaction',
      href: '/admin/sales',
      icon: ShoppingCart,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      title: 'Add Product',
      description: 'Add new product to inventory',
      href: '/admin/products/new',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      title: 'View Products',
      description: 'Manage product inventory',
      href: '/admin/products',
      icon: Package,
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    {
      title: 'Sales Report',
      description: 'View sales analytics',
      href: '/admin/reports/daily',
      icon: BarChart3,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      title: 'Manage Users',
      description: 'Add or remove staff users',
      href: '/admin/settings/users',
      icon: Users,
      color: 'bg-cyan-500 hover:bg-cyan-600',
    },
    {
      title: 'Balance Sheet',
      description: 'Export financial reports',
      href: '/admin/reports/balancesheet',
      icon: FileText,
      color: 'bg-indigo-500 hover:bg-indigo-600',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
              >
                <div className={`p-3 rounded-lg text-white ${action.color}`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}