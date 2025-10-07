'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { authUtils } from '@/lib/auth'
import { toast } from 'sonner'
import {
  ShoppingCart,
  LogOut,
  Wifi,
  WifiOff,
  RotateCcw,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { useSync } from '@/hooks/use-sync'

interface StaffLayoutProps {
  children: React.ReactNode
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const router = useRouter()
  const { syncStatus } = useUIStore()
  const { syncNow } = useSync()
  
  const user = authUtils.getUser()

  const handleLogout = () => {
    authUtils.logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-500" />
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-500" />
      case 'syncing':
        return <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">POS Staff</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              {getSyncIcon()}
              <span className="capitalize">{syncStatus}</span>
              {syncStatus === 'online' && (
                <button
                  onClick={syncNow}
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Sync now"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="p-4 sm:p-6">
        {children}
      </main>
    </div>
  )
}