"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Download, Bell, User } from "lucide-react"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"
import type { NavigationItem } from "@/types/lamoda"

const navigation: NavigationItem[] = [
  { name: "Главная", href: "/" },
  { name: "Заказы", href: "/orders" },
  { name: "Логистика", href: "/logistics" },
  { name: "Товары", href: "/products" },
  { name: "Акции", href: "/promotions" },
  { name: "Аналитика", href: "/analytics" },
  { name: "Продвижение", href: "/marketing" },
]

export function LamodaHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-lg sticky top-0 z-40">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-base md:text-lg font-semibold text-foreground">
                lamoda
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                seller
              </span>
            </Link>

            {/* Navigation - скрыта на мобильных */}
            <nav className="hidden lg:flex items-center gap-6">
              {navigation.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/" && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative",
                      isActive 
                        ? "text-foreground after:absolute after:bottom-[-16px] after:left-0 after:right-0 after:h-0.5 after:bg-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* User menu - скрыт на очень маленьких экранах */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-medium truncate max-w-24 md:max-w-none">mark mp cd</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <Download className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="h-8 w-8 md:h-10 md:w-10">
                <Bell className="h-4 w-4" />
              </Button>
              
              {/* Mobile menu trigger - показать только на sm экранах */}
              <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 