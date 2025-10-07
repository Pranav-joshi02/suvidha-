'use client'

import { Button } from '@/components/ui/button'
import { useSync } from '@/hooks/use-sync'
import { useUIStore } from '@/stores/ui-store'
import { formatDate } from '@/lib/utils'
import { 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

export function SyncIndicator() {
  const { syncStatus, syncNow } = useSync()
  const { lastSyncTime } = useUIStore()

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'online':
        return <Wifi className="w-4 h-4 text-green-500" />
      case 'offline':
        return <WifiOff className="w-4 h-4 text-red-500" />
      case 'syncing':
        return <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      default:
        return <Wifi className="w-4 h-4 text-gray-400" />
    }
  }

  const getSyncText = () => {
    switch (syncStatus) {
      case 'online':
        return 'Online'
      case 'offline':
        return 'Offline'
      case 'syncing':
        return 'Syncing...'
      case 'error':
        return 'Sync Error'
      default:
        return 'Unknown'
    }
  }

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'online':
        return 'text-green-600'
      case 'offline':
        return 'text-red-600'
      case 'syncing':
        return 'text-blue-600'
      case 'error':
        return 'text-orange-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        {getSyncIcon()}
        <span className={`text-sm font-medium ${getSyncColor()}`}>
          {getSyncText()}
        </span>
      </div>
      
      {lastSyncTime && syncStatus !== 'syncing' && (
        <div className="text-xs text-gray-500">
          Last sync: {formatDate(lastSyncTime)}
        </div>
      )}
      
      {syncStatus === 'online' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={syncNow}
          className="h-8 px-2"
        >
          <RefreshCw className="w-3 h-3" />
        </Button>
      )}
    </div>
  )
}