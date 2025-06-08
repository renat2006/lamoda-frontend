"use client"

import { useState, useEffect } from "react"
import { WifiOff, Wifi, CloudOff, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNetworkStatus, offlineManager } from "@/lib/storage"

interface OfflineIndicatorProps {
  className?: string
}

export function OfflineIndicator({ className }: OfflineIndicatorProps) {
  const isOnline = useNetworkStatus()
  const [showIndicator, setShowIndicator] = useState(false) // Always start hidden for SSR consistency
  const [pendingActionsCount, setPendingActionsCount] = useState(0)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Don't run on server side
    
    // Update pending actions count
    const updatePendingCount = () => {
      const pending = offlineManager.getPendingActions()
      setPendingActionsCount(pending.length)
    }

    updatePendingCount()
    
    // Show indicator when going offline, hide after a delay when coming online
    if (!isOnline) {
      setShowIndicator(true)
    } else {
      // Sync pending actions when coming back online
      const pending = offlineManager.getPendingActions()
      if (pending.length > 0) {
        // Here you would typically sync with your API
        console.log('Syncing pending actions:', pending)
        setTimeout(() => {
          offlineManager.clearPendingActions()
          setLastSync(new Date())
          updatePendingCount()
        }, 2000) // Simulate sync delay
      }
      
      // Hide indicator after showing "back online" message
      setTimeout(() => setShowIndicator(false), 3000)
    }
  }, [isOnline, isClient])

  if (!showIndicator) return null

  return (
    <div className={cn(
      "fixed top-16 left-4 right-4 z-40 mx-auto max-w-sm",
      "md:top-20 md:left-auto md:right-6 md:max-w-xs",
      className
    )}>
      <div className={cn(
        "rounded-lg p-3 shadow-lg border backdrop-blur-sm transition-all duration-300",
        isOnline 
          ? "bg-green-50 border-green-200 text-green-800" 
          : "bg-red-50 border-red-200 text-red-800"
      )}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            {!isOnline ? (
              <WifiOff className="h-5 w-5" />
            ) : (
              <CheckCircle className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">
              {isOnline ? "Подключение восстановлено" : "Работаем оффлайн"}
            </div>
            
            <div className="text-xs opacity-80 mt-1">
              {isOnline ? (
                lastSync ? (
                  `Данные синхронизированы ${lastSync.toLocaleTimeString()}`
                ) : (
                  "Все функции доступны"
                )
              ) : (
                "Доступны сохранённые данные"
              )}
            </div>
            
            {pendingActionsCount > 0 && (
              <div className="text-xs mt-1 flex items-center gap-1">
                {isOnline ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Синхронизация...
                  </>
                ) : (
                  <>
                    <CloudOff className="h-3 w-3" />
                    {pendingActionsCount} действий в очереди
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mini network status indicator for navigation
export function NetworkStatusBadge() {
  const isOnline = useNetworkStatus()
  
  return (
    <div className={cn(
      "w-2 h-2 rounded-full transition-colors",
      isOnline ? "bg-green-500" : "bg-red-500"
    )} />
  )
} 