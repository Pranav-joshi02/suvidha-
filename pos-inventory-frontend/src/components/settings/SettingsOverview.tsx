'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  Settings as SettingsIcon, 
  Shield,
  AlertTriangle,
  Store,
  Key
} from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useRouter } from 'next/navigation'

export function SettingsOverview() {
  const [lowStockThreshold, setLowStockThreshold] = useState(5)
  const [shopName, setShopName] = useState('My Shop')
  const [shopAddress, setShopAddress] = useState('123 Main St, City, State 12345')
  const router = useRouter()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiClient.getSettings(),
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.getUsers(),
  })

  const handleSaveSettings = () => {
    // TODO: Implement settings save
    console.log('Save settings:', { lowStockThreshold, shopName, shopAddress })
  }

  const handleAddUser = () => {
    // TODO: Implement add user
    console.log('Add user')
  }

  const handleChangePassword = () => {
    // TODO: Implement change password
    console.log('Change password')
  }

  if (isLoading || usersLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded"></div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your system configuration and users.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shop Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Shop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopAddress">Shop Address</Label>
              <Input
                id="shopAddress"
                value={shopAddress}
                onChange={(e) => setShopAddress(e.target.value)}
                placeholder="Enter shop address"
              />
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Shop Settings
            </Button>
          </CardContent>
        </Card>

        {/* Inventory Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Inventory Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 0)}
                placeholder="Enter threshold"
              />
              <p className="text-sm text-gray-600">
                Products with stock below this number will be marked as low stock.
              </p>
            </div>
            <Button onClick={handleSaveSettings} className="w-full">
              Save Inventory Settings
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Manage staff users and their access levels.
              </p>
              <div className="space-y-2">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={handleAddUser} className="w-full">
              Add New User
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Manage your account security settings.
              </p>
            </div>
            <Button onClick={handleChangePassword} className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}