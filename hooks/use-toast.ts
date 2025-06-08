"use client"

import { createContext, useContext, useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

interface ToastContextType {
  toasts: Toast[]
  toast: (props: Omit<Toast, "id">) => void
  dismiss: (toastId?: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    // Fallback implementation for when context is not available
    return {
      toast: ({ title, description, variant }: Omit<Toast, "id">) => {
        if (variant === "destructive") {
          console.error(`${title}: ${description}`)
        } else {
          console.log(`${title}: ${description}`)
        }
      },
      dismiss: () => {},
      toasts: []
    }
  }
  return context
}

export function useToastProvider() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, action, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, title, description, action, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    if (toastId) {
      setToasts(prev => prev.filter(t => t.id !== toastId))
    } else {
      setToasts([])
    }
  }, [])

  return { toasts, toast, dismiss }
} 