'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { useKPIData } from '@/hooks/api'
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'

export function KPICards() {
  const { data: kpiData, isLoading } = useKPIData()

  const cards = [
    {
      title: 'Total Products',
      value: kpiData?.totalProducts || 0,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      format: (value: number) => value.toString(),
    },
    {
      title: 'Daily Revenue',
      value: kpiData?.dailyRevenue || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      format: (value: number) => formatCurrency(value),
    },
    {
      title: 'Daily Profit',
      value: kpiData?.dailyProfit || 0,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      format: (value: number) => formatCurrency(value),
    },
    {
      title: 'Low Stock Items',
      value: kpiData?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      format: (value: number) => value.toString(),
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {card.format(card.value)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {index === 3 && card.value > 0 ? 'Needs attention' : 'Updated now'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}