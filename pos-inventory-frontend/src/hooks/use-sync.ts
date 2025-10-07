'use client'

import { useEffect, useCallback } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { toast } from 'sonner'

export function useSync() {
  const { syncStatus, setSyncStatus, setLastSyncTime } = useUIStore()

  // Check online status
  const updateOnlineStatus = useCallback(() => {
    const isOnline = navigator.onLine
    setSyncStatus(isOnline ? 'online' : 'offline')
    
    if (isOnline) {
      // Simulate sync when coming back online
      setSyncStatus('syncing')
      setTimeout(() => {
        setSyncStatus('online')
        setLastSyncTime(new Date())
        toast.success('Data synchronized successfully')
      }, 2000)
    } else {
      toast.warning('You are now offline. Changes will be synced when connection is restored.')
    }
  }, [setSyncStatus, setLastSyncTime])

  // Manual sync function
  const syncNow = useCallback(async () => {
    if (!navigator.onLine) {
      toast.error('Cannot sync while offline')
      return
    }

    setSyncStatus('syncing')
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSyncStatus('online')
      setLastSyncTime(new Date())
      toast.success('Data synchronized successfully')
    } catch (error) {
      setSyncStatus('error')
      toast.error('Sync failed. Please try again.')
      
      // Reset to online after error
      setTimeout(() => {
        setSyncStatus('online')
      }, 3000)
    }
  }, [setSyncStatus, setLastSyncTime])

  useEffect(() => {
    // Set initial status
    updateOnlineStatus()

    // Listen for online/offline events
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Auto-sync every 5 minutes when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine && syncStatus === 'online') {
        syncNow()
      }
    }, 5 * 60 * 1000) // 5 minutes

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
      clearInterval(syncInterval)
    }
  }, [updateOnlineStatus, syncNow, syncStatus])

  return {
    syncStatus,
    syncNow,
  }
}