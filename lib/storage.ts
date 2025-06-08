import { useState, useEffect } from "react"

// Utilities for local storage and offline functionality

interface StorageItem<T> {
  data: T
  timestamp: number
  expiry?: number
}

class LocalStorageManager {
  private prefix = 'lamoda_seller_'

  // Generic storage methods with expiry support
  set<T>(key: string, data: T, expiryMinutes = 60): void {
    try {
      const item: StorageItem<T> = {
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
      }
      localStorage.setItem(this.prefix + key, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  get<T>(key: string): T | null {
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) return null

      const item: StorageItem<T> = JSON.parse(stored)
      
      // Check if expired
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key)
        return null
      }

      return item.data
    } catch (error) {
      console.warn('Failed to read from localStorage:', error)
      return null
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key)
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }

  clear(): void {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .forEach(key => localStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }

  // Check if data is fresh (within last N minutes)
  isFresh(key: string, maxAgeMinutes = 5): boolean {
    try {
      const stored = localStorage.getItem(this.prefix + key)
      if (!stored) return false

      const item: StorageItem<any> = JSON.parse(stored)
      const maxAge = maxAgeMinutes * 60 * 1000
      return (Date.now() - item.timestamp) < maxAge
    } catch {
      return false
    }
  }
}

// User preferences storage
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'ru' | 'en'
  currency: 'RUB' | 'USD' | 'EUR'
  timezone: string
  notifications: {
    orders: boolean
    products: boolean
    analytics: boolean
    marketing: boolean
  }
  dashboard: {
    defaultPeriod: string
    favoriteMetrics: string[]
    layoutMode: 'grid' | 'list'
  }
  mobile: {
    quickActions: string[]
    showTutorials: boolean
    compactMode: boolean
  }
}

// Filter preferences storage
export interface FilterPreferences {
  products: {
    status: string
    category: string
    sortBy: string
    viewMode: 'grid' | 'list'
  }
  orders: {
    status: string
    period: string
    sortBy: string
    urgent: boolean
  }
  analytics: {
    period: string
    metrics: string[]
    chartType: string
  }
}

// Cache for API responses
export interface CacheData {
  products: any[]
  orders: any[]
  analytics: any
  notifications: any[]
}

// Main storage instance
export const storage = new LocalStorageManager()

// Specialized storage functions
export const userPreferences = {
  get: (): UserPreferences | null => storage.get<UserPreferences>('user_preferences'),
  set: (prefs: Partial<UserPreferences>): void => {
    const current = userPreferences.get() || getDefaultPreferences()
    storage.set('user_preferences', { ...current, ...prefs }, 24 * 60) // 24 hours
  },
  update: (updates: Partial<UserPreferences>): void => {
    const current = userPreferences.get()
    if (current) {
      userPreferences.set({ ...current, ...updates })
    }
  }
}

export const filterPreferences = {
  get: (): FilterPreferences | null => storage.get<FilterPreferences>('filter_preferences'),
  set: (filters: Partial<FilterPreferences>): void => {
    const current = filterPreferences.get() || getDefaultFilters()
    storage.set('filter_preferences', { ...current, ...filters }, 7 * 24 * 60) // 7 days
  }
}

export const cacheData = {
  get: (key: keyof CacheData): any => storage.get(key),
  set: (key: keyof CacheData, data: any, minutes = 15): void => storage.set(key, data, minutes),
  isFresh: (key: keyof CacheData, maxAgeMinutes = 5): boolean => storage.isFresh(key, maxAgeMinutes)
}

// Offline status tracking  
export const offlineManager = {
  isOnline: (): boolean => typeof window !== 'undefined' ? navigator.onLine : true,
  
  setOfflineData: (data: any): void => {
    storage.set('offline_data', data, 24 * 60) // 24 hours
  },
  
  getOfflineData: (): any => storage.get('offline_data'),
  
  addPendingAction: (action: any): void => {
    const pending = storage.get<any[]>('pending_actions') || []
    pending.push({ ...action, timestamp: Date.now() })
    storage.set('pending_actions', pending, 7 * 24 * 60) // 7 days
  },
  
  getPendingActions: (): any[] => storage.get<any[]>('pending_actions') || [],
  
  clearPendingActions: (): void => storage.remove('pending_actions')
}

// Default values
function getDefaultPreferences(): UserPreferences {
  return {
    theme: 'light',
    language: 'ru',
    currency: 'RUB',
    timezone: 'Europe/Moscow',
    notifications: {
      orders: true,
      products: true,
      analytics: false,
      marketing: false
    },
    dashboard: {
      defaultPeriod: 'month',
      favoriteMetrics: ['revenue', 'orders', 'conversion'],
      layoutMode: 'grid'
    },
    mobile: {
      quickActions: ['add_product', 'view_orders', 'analytics'],
      showTutorials: true,
      compactMode: false
    }
  }
}

function getDefaultFilters(): FilterPreferences {
  return {
    products: {
      status: 'all',
      category: 'all',
      sortBy: 'name',
      viewMode: 'list'
    },
    orders: {
      status: 'all',
      period: 'week',
      sortBy: 'date',
      urgent: false
    },
    analytics: {
      period: 'month',
      metrics: ['revenue', 'orders'],
      chartType: 'area'
    }
  }
}

// Hook for React components
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue) // Start with default for SSR

  // Load from localStorage on client side
  useEffect(() => {
    const stored = storage.get<T>(key)
    if (stored !== null) {
      setValue(stored)
    }
  }, [key])

  const setStoredValue = (newValue: T) => {
    setValue(newValue)
    storage.set(key, newValue)
  }

  return [value, setStoredValue] as const
}

// Network status hook
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true) // Default to online for SSR

  useEffect(() => {
    // Set initial state on client side
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
} 