'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { authUtils } from '@/lib/auth'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  RotateCcw,
} from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { useSync } from '@/hooks/use-sync'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    name: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    name: 'Sales',
    href: '/admin/sales',
    icon: ShoppingCart,
  },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: BarChart3,
  },
  {
    name: 'Users',
    href: '/admin/settings/users',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">POS Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              {getSyncIcon()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-gray-900">
                  {navigation.find(item => 
                    pathname === item.href || 
                    (item.href !== '/admin' && pathname.startsWith(item.href))
                  )?.name || 'Dashboard'}
                </h1>
              </div>
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
              <div className="hidden sm:block text-sm text-gray-500">
                Welcome, {user?.name}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}