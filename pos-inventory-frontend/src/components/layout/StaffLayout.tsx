'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Store, 
  ShoppingCart, 
  Package, 
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface StaffLayoutProps {
  children: ReactNode
}

const quickActions = [
  { name: 'Record Sale', href: '/staff/pos', icon: ShoppingCart },
  { name: 'Check Stock', href: '/staff/stock', icon: Package },
]

export function StaffLayout({ children }: StaffLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Store className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-lg font-semibold">POS System</span>
        </div>

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex flex-1"></div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.name}
                variant="outline"
                onClick={() => router.push(action.href)}
                className="flex items-center"
              >
                <Icon className="mr-2 h-4 w-4" />
                {action.name}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Page content */}
      <main className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}