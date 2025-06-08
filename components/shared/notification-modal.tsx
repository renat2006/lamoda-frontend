'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { CheckCircle, AlertTriangle, XCircle, Info, Download, Printer } from "lucide-react"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  actionType?: 'export' | 'print' | 'confirm' | 'info'
  onAction?: () => void
  actionLabel?: string
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
}

const colors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
}

const backgrounds = {
  success: 'bg-green-50',
  error: 'bg-red-50',
  warning: 'bg-yellow-50',
  info: 'bg-blue-50'
}

export function NotificationModal({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  actionType,
  onAction,
  actionLabel
}: NotificationModalProps) {
  const Icon = icons[type]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`w-12 h-12 rounded-full ${backgrounds[type]} flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`h-6 w-6 ${colors[type]}`} />
          </div>
          <DialogTitle className="text-center text-lg font-medium text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mt-2">
            {message}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          {actionType && actionType !== 'info' && (
            <LamodaButton 
              onClick={onAction}
              className="flex-1"
            >
              {actionType === 'export' && <Download className="h-4 w-4 mr-2" />}
              {actionType === 'print' && <Printer className="h-4 w-4 mr-2" />}
              {actionLabel || 'Продолжить'}
            </LamodaButton>
          )}
          <LamodaButton 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            {actionType === 'info' ? 'Понятно' : 'Отмена'}
          </LamodaButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Context для глобального управления уведомлениями
import { createContext, useContext, ReactNode } from 'react'

interface NotificationContextType {
  showNotification: (props: Omit<NotificationModalProps, 'isOpen' | 'onClose'>) => void
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showConfirm: (title: string, message: string, onConfirm: () => void) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<(NotificationModalProps & { id: string }) | null>(null)

  const showNotification = (props: Omit<NotificationModalProps, 'isOpen' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setNotification({
      ...props,
      id,
      isOpen: true,
      onClose: () => setNotification(null)
    })
  }

  const showSuccess = (title: string, message: string) => {
    showNotification({ type: 'success', title, message, actionType: 'info' })
  }

  const showError = (title: string, message: string) => {
    showNotification({ type: 'error', title, message, actionType: 'info' })
  }

  const showWarning = (title: string, message: string) => {
    showNotification({ type: 'warning', title, message, actionType: 'info' })
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    showNotification({
      type: 'warning',
      title,
      message,
      actionType: 'confirm',
      actionLabel: 'Подтвердить',
      onAction: () => {
        onConfirm()
        setNotification(null)
      }
    })
  }

  return (
    <NotificationContext.Provider value={{ showNotification, showSuccess, showError, showWarning, showConfirm }}>
      {children}
      {notification && (
        <NotificationModal
          isOpen={notification.isOpen}
          onClose={notification.onClose}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          actionType={notification.actionType}
          onAction={notification.onAction}
          actionLabel={notification.actionLabel}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
} 