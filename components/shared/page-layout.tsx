"use client"

import { Header } from "./header"
import { MobileNav, useMobileNav } from "./mobile-nav"
import { OfflineIndicator } from "./offline-indicator"

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  const { shouldShow } = useMobileNav()

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Header />
      
      {/* Offline Status Indicator */}
      <OfflineIndicator />
      
      <main className="container-safe">
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className={`py-6 md:py-8 ${shouldShow ? 'pb-20 md:pb-8' : ''} ${className || ''}`}>
            {children}
          </div>
        </div>
      </main>
      
      {shouldShow && <MobileNav />}
    </div>
  )
} 