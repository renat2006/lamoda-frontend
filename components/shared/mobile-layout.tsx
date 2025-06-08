"use client"

import { LamodaHeader } from "./lamoda-header"
import { MobileNav, useMobileNav } from "./mobile-nav"
import { cn } from "@/lib/utils"

interface MobileLayoutProps {
  children: React.ReactNode
  className?: string
  showSidebar?: boolean
  sidebar?: React.ReactNode
}

export function MobileLayout({ 
  children, 
  className, 
  showSidebar = false,
  sidebar 
}: MobileLayoutProps) {
  const { shouldShow } = useMobileNav()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LamodaHeader />
      
      <div className="flex flex-1 relative">
        {/* Main content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "min-h-0", // Важно для правильного overflow
          shouldShow && "pb-24 md:pb-0", // Увеличенный отступ для новой навигации
          showSidebar && "xl:mr-80", // Отступ для sidebar только на больших экранах
          className
        )}>
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* Desktop sidebar */}
        {showSidebar && sidebar && (
          <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 overflow-y-auto border-l border-border bg-background/50 backdrop-blur-sm z-30">
            <div className="h-full">
              {sidebar}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile navigation */}
      {shouldShow && <MobileNav />}
    </div>
  )
}

// Улучшенная обертка для страниц с адаптивными отступами
interface PageWrapperProps {
  children: React.ReactNode
  className?: string
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  padding?: "none" | "sm" | "md" | "lg"
}

export function PageWrapper({ 
  children, 
  className,
  maxWidth = "full",
  padding = "md"
}: PageWrapperProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-4xl",
    lg: "max-w-6xl", 
    xl: "max-w-7xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
  }

  const paddingClasses = {
    none: "",
    sm: "px-3 sm:px-4 py-3 sm:py-4",
    md: "px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8",
    lg: "px-6 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-12"
  }

  return (
    <div className={cn(
      "animate-in fade-in-0 duration-300 slide-in-from-bottom-4",
      "w-full max-w-full mx-auto overflow-x-hidden",
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  )
}

// Адаптивная сетка для карточек
interface ResponsiveGridProps {
  children: React.ReactNode
  columns?: {
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: "sm" | "md" | "lg"
  className?: string
}

export function ResponsiveGrid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = "md",
  className 
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4 md:gap-6", 
    lg: "gap-6 md:gap-8"
  }

  const getColumnClass = () => {
    const classes = ["grid"]
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`)
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`)
    return classes.join(" ")
  }

  return (
    <div className={cn(
      getColumnClass(),
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Анимированный контейнер для карточек с задержкой
interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
  direction?: "up" | "down" | "left" | "right"
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className,
  direction = "up"
}: AnimatedCardProps) {
  const directionClasses = {
    up: "slide-in-from-bottom-4",
    down: "slide-in-from-top-4", 
    left: "slide-in-from-right-4",
    right: "slide-in-from-left-4"
  }

  return (
    <div 
      className={cn(
        "animate-in fade-in-0 duration-500",
        directionClasses[direction],
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'backwards'
      }}
    >
      {children}
    </div>
  )
}

// Адаптивный контейнер для статистик/метрик
interface StatsContainerProps {
  children: React.ReactNode
  className?: string
}

export function StatsContainer({ children, className }: StatsContainerProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",
      className
    )}>
      {children}
    </div>
  )
}

// Адаптивная карточка статистик
interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral",
  icon,
  className 
}: StatCardProps) {
  const changeColorClasses = {
    positive: "text-green-600",
    negative: "text-red-600", 
    neutral: "text-muted-foreground"
  }

  return (
    <div className={cn(
      "bg-background border border-border rounded-xl p-4 md:p-6 hover:shadow-md transition-all duration-200",
      "hover:border-border/60",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className="h-8 w-8 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl md:text-3xl font-bold text-foreground">{value}</p>
        {change && (
          <p className={cn("text-xs md:text-sm", changeColorClasses[changeType])}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
} 