'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { ReportData } from '@/types'

interface SalesChartProps {
  data: ReportData[]
  type: 'line' | 'bar'
  title: string
}

export function SalesChart({ data, type, title }: SalesChartProps) {
  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'salesCount') {
      return [value, 'Sales']
    }
    return [formatCurrency(value), name]
  }

  const formatXAxisLabel = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const Chart = type === 'line' ? LineChart : BarChart

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxisLabel}
              fontSize={12}
            />
            <YAxis 
              yAxisId="currency"
              orientation="left"
              tickFormatter={(value) => formatCurrency(value)}
              fontSize={12}
            />
            <YAxis 
              yAxisId="count"
              orientation="right"
              fontSize={12}
            />
            <Tooltip 
              formatter={formatTooltipValue}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Legend />
            
            {type === 'line' ? (
              <>
                <Line
                  yAxisId="currency"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  yAxisId="currency"
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Profit"
                />
                <Line
                  yAxisId="count"
                  type="monotone"
                  dataKey="salesCount"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Sales Count"
                />
              </>
            ) : (
              <>
                <Bar
                  yAxisId="currency"
                  dataKey="revenue"
                  fill="#3b82f6"
                  name="Revenue"
                />
                <Bar
                  yAxisId="currency"
                  dataKey="profit"
                  fill="#10b981"
                  name="Profit"
                />
              </>
            )}
          </Chart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}