// Utility functions for consistent formatting between server and client

/**
 * Format number with Russian locale (space as thousands separator)
 * Provides consistent formatting on both server and client to prevent hydration mismatches
 */
export function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Format currency in rubles with consistent formatting
 */
export function formatCurrency(amount: number): string {
  return `${formatNumber(amount)} ₽`
}

/**
 * Format price with optional original price for discounts
 */
export function formatPrice(price: number, originalPrice?: number): string {
  const formatted = formatCurrency(price)
  if (originalPrice && originalPrice > price) {
    return `${formatted} (было ${formatCurrency(originalPrice)})`
  }
  return formatted
}

/**
 * Format percentage with consistent decimal places
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return formatNumber(num)
}

/**
 * Format date consistently between server and client
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}

/**
 * Format datetime consistently
 */
export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
} 