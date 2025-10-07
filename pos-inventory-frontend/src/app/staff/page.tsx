'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { StaffLayout } from '@/components/layout/StaffLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, BarChart3 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function StaffDashboard() {
  const { isAuthenticated, isStaff, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!isStaff) {
        router.push('/admin')
      }
    }
  }, [isAuthenticated, isStaff, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated || !isStaff) {
    return null
  }

  return (
    <StaffLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600">Quick access to essential POS functions.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Record Sale
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Process a new sale quickly and efficiently.
              </p>
              <Button 
                className="w-full" 
                onClick={() => router.push('/staff/pos')}
              >
                Start Sale
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Check Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View product availability and stock levels.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/staff/stock')}
              >
                View Stock
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Today's Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View today's sales performance.
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push('/staff/sales')}
              >
                View Sales
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </StaffLayout>
  )
}