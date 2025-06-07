import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Haptic feedback для мобильных устройств
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 40,
      selection: [5, 5]
    }
    
    const pattern = patterns[type]
    if (Array.isArray(pattern)) {
      navigator.vibrate(pattern)
    } else {
      navigator.vibrate(pattern)
    }
  }
}

// Проверка поддержки touch устройств
export function isTouchDevice() {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// Debounce функция для оптимизации производительности
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle для scroll событий
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      func(...args)
    }
  }
} 