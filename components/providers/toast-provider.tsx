"use client"

import { ToastContext, useToastProvider } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const toastContextValue = useToastProvider()

  return (
    <ToastContext.Provider value={toastContextValue}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
} 