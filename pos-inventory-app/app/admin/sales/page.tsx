'use client'

import { useState } from 'react'
import { AdminLayout } from '@/components/layouts/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useSales } from '@/hooks/use-sales'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Search, Filter } from 'lucide-react'
import Link from 'next/link'

export default function SalesHistoryPage() {
  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const { data, isLoading } = useSales({
    from: fromDate || undefined,
    to: toDate || undefined,
    page,
    limit: 10,
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Sales History</h2>
          <p className="text-gray-600">View and filter all sales transactions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFromDate('')
                    setToDate('')
                  }}
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Sales</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">Loading sales...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sale ID</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Cashier</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data && data.data.length > 0 ? (
                      data.data.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell className="font-medium">{sale.id}</TableCell>
                          <TableCell>{formatDateTime(sale.createdAt)}</TableCell>
                          <TableCell>{sale.items.length} items</TableCell>
                          <TableCell>{sale.soldBy.name}</TableCell>
                          <TableCell>{formatCurrency(sale.subtotal)}</TableCell>
                          <TableCell>
                            {sale.discount > 0 ? (
                              <span className="text-red-600">
                                -{formatCurrency(sale.discount)}
                              </span>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(sale.total)}
                          </TableCell>
                          <TableCell className="text-green-600 font-medium">
                            {formatCurrency(sale.totalProfit)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/print/receipt/${sale.id}`}>
                              <Button variant="outline" size="sm">
                                View Receipt
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-gray-500">
                          No sales found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {data && data.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600">
                      Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, data.total)} of{' '}
                      {data.total} sales
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === data.totalPages}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}