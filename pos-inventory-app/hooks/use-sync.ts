'use client'

import { useState, useEffect } from 'react'
import { SyncStatus } from '@/lib/types'

export function useSyncStatus() {
  const [status, setStatus] = useState<SyncStatus>({
    lastSync: null,
    isSyncing: false,
    pendingChanges: 0,
    status: 'online',
  })

  useEffect(() => {
    // Check online/offline status
    const updateOnlineStatus = () => {
      setStatus((prev) => ({
        ...prev,
        status: navigator.onLine ? 'online' : 'offline',
      }))
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    // Initial check
    updateOnlineStatus()

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  const syncNow = async () => {
    if (status.isSyncing) return

    setStatus((prev) => ({ ...prev, isSyncing: true }))

    try {
      // Simulate sync operation
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setStatus((prev) => ({
        ...prev,
        isSyncing: false,
        lastSync: new Date().toISOString(),
        pendingChanges: 0,
      }))
    } catch (error) {
      setStatus((prev) => ({ ...prev, isSyncing: false }))
    }
  }

  return { status, syncNow }
}