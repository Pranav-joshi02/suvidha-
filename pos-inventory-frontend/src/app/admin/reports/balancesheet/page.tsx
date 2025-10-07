'use client'

import { AdminLayout } from '@/components/layouts/admin-layout'
import { BalanceSheetExport } from '@/components/reports/balance-sheet-export'

export default function BalanceSheetPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p className="text-gray-600 mt-1">
            Export financial reports and balance sheets for different time periods
          </p>
        </div>

        <BalanceSheetExport />
      </div>
    </AdminLayout>
  )
}