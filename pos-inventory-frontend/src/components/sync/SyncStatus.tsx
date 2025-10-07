'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Clock
} from 'lucide-react'
import { SyncStatus as SyncStatusType } from '@/types'

export function SyncStatus() {
  const [syncStatus, setSyncStatus] = useState<SyncStatusType>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingChanges: 0,
  })

  useEffect(() => {
    const handleOnline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: true }))
    }

    const handleOffline = () => {
      setSyncStatus(prev => ({ ...prev, isOnline: false }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Simulate last sync time
    const lastSync = localStorage.getItem('lastSync')
    if (lastSync) {
      setSyncStatus(prev => ({ ...prev, lastSync: new Date(lastSync) }))
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSync = async () => {
    try {
      // Simulate sync process
      setSyncStatus(prev => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update sync status
      const now = new Date()
      localStorage.setItem('lastSync', now.toISOString())
      setSyncStatus(prev => ({
        ...prev,
        lastSync: now,
        pendingChanges: 0,
      }))
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  const getStatusIcon = () => {
    if (!syncStatus.isOnline) {
      return <WifiOff className="h-4 w-4 text-red-500" />
    }
    if (syncStatus.pendingChanges > 0) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusText = () => {
    if (!syncStatus.isOnline) {
      return 'Offline'
    }
    if (syncStatus.pendingChanges > 0) {
      return `${syncStatus.pendingChanges} pending changes`
    }
    return 'Synced'
  }

  const getStatusColor = () => {
    if (!syncStatus.isOnline) {
      return 'destructive'
    }
    if (syncStatus.pendingChanges > 0) {
      return 'secondary'
    }
    return 'default'
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            {syncStatus.isOnline ? (
              <Wifi className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 mr-2 text-red-500" />
            )}
            Sync Status
          </span>
          <Badge variant={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Connection:</span>
            <span className={syncStatus.isOnline ? 'text-green-600' : 'text-red-600'}>
              {syncStatus.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Sync:</span>
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {syncStatus.lastSync 
                ? syncStatus.lastSync.toLocaleString()
                : 'Never'
              }
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Pending Changes:</span>
            <span className={syncStatus.pendingChanges > 0 ? 'text-orange-600' : 'text-green-600'}>
              {syncStatus.pendingChanges}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleSync}
          disabled={!syncStatus.isOnline}
          className="w-full"
          variant={syncStatus.isOnline ? 'default' : 'outline'}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {syncStatus.isOnline ? 'Sync Now' : 'Offline Mode'}
        </Button>

        {!syncStatus.isOnline && (
          <p className="text-xs text-gray-500 text-center">
            Changes will be synced when connection is restored
          </p>
        )}
      </CardContent>
    </Card>
  )
}