'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSettings, useUpdateSettings } from '@/hooks/api'
import { toast } from 'sonner'
import { Settings as SettingsIcon, Store, Percent, AlertTriangle } from 'lucide-react'

const settingsSchema = z.object({
  shopName: z.string().min(1, 'Shop name is required'),
  shopAddress: z.string().min(1, 'Shop address is required'),
  taxRate: z.number().min(0).max(100, 'Tax rate must be between 0 and 100'),
  lowStockThreshold: z.number().int().min(1, 'Threshold must be at least 1'),
  currency: z.string().min(1, 'Currency is required'),
})

type SettingsFormData = z.infer<typeof settingsSchema>

export function GeneralSettings() {
  const { data: settings, isLoading } = useSettings()
  const updateSettingsMutation = useUpdateSettings()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    values: settings ? {
      shopName: settings.shopName,
      shopAddress: settings.shopAddress,
      taxRate: settings.taxRate,
      lowStockThreshold: settings.lowStockThreshold,
      currency: settings.currency,
    } : undefined,
  })

  const onSubmit = async (data: SettingsFormData) => {
    try {
      await updateSettingsMutation.mutateAsync(data)
      toast.success('Settings updated successfully!')
    } catch (error) {
      toast.error('Failed to update settings')
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <SettingsIcon className="w-5 h-5 mr-2" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Shop Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Store className="w-4 h-4" />
              <span>Shop Information</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              <div className="space-y-2">
                <Label htmlFor="shopName">Shop Name *</Label>
                <Input
                  id="shopName"
                  {...register('shopName')}
                  placeholder="Enter shop name"
                />
                {errors.shopName && (
                  <p className="text-sm text-red-500">{errors.shopName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Input
                  id="currency"
                  {...register('currency')}
                  placeholder="USD"
                />
                {errors.currency && (
                  <p className="text-sm text-red-500">{errors.currency.message}</p>
                )}
              </div>
            </div>

            <div className="pl-6">
              <div className="space-y-2">
                <Label htmlFor="shopAddress">Shop Address *</Label>
                <Input
                  id="shopAddress"
                  {...register('shopAddress')}
                  placeholder="Enter complete shop address"
                />
                {errors.shopAddress && (
                  <p className="text-sm text-red-500">{errors.shopAddress.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Percent className="w-4 h-4" />
              <span>Financial Settings</span>
            </div>
            
            <div className="pl-6">
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  {...register('taxRate', { valueAsNumber: true })}
                  placeholder="8.5"
                />
                {errors.taxRate && (
                  <p className="text-sm text-red-500">{errors.taxRate.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Tax rate applied to sales (0 for no tax)
                </p>
              </div>
            </div>
          </div>

          {/* Inventory Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Inventory Settings</span>
            </div>
            
            <div className="pl-6">
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Threshold *</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="1"
                  {...register('lowStockThreshold', { valueAsNumber: true })}
                  placeholder="10"
                />
                {errors.lowStockThreshold && (
                  <p className="text-sm text-red-500">{errors.lowStockThreshold.message}</p>
                )}
                <p className="text-sm text-gray-500">
                  Products with stock below this number will be marked as low stock
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={updateSettingsMutation.isPending}
              className="w-full md:w-auto"
            >
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}