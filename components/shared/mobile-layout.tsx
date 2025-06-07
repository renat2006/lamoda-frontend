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
      
      <div className={cn("flex flex-1", showSidebar && "lg:mr-80")}>
        {/* Main content */}
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          shouldShow && "pb-20 md:pb-0", // Отступ снизу для мобильной навигации
          className
        )}>
          {children}
        </main>

        {/* Desktop sidebar */}
        {showSidebar && sidebar && (
          <aside className="hidden lg:block fixed right-0 top-16 bottom-0 w-80 overflow-y-auto">
            {sidebar}
          </aside>
        )}
      </div>

      {/* Mobile navigation */}
      {shouldShow && <MobileNav />}
    </div>
  )
}

// Обертка для страниц с анимациями
interface PageWrapperProps {
  children: React.ReactNode
  className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn(
      "animate-in fade-in-0 duration-300 slide-in-from-bottom-4",
      "max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6",
      className
    )}>
      {children}
    </div>
  )
}

// Анимированный контейнер для карточек
interface AnimatedCardProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function AnimatedCard({ children, delay = 0, className }: AnimatedCardProps) {
  return (
    <div 
      className={cn(
        "animate-in fade-in-0 duration-500 slide-in-from-bottom-4",
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