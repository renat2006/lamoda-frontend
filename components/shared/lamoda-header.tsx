"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChevronDown, 
  Download, 
  Bell, 
  User, 
  Menu, 
  X,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  Truck,
  Megaphone
} from "lucide-react"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"
import type { NavigationItem } from "@/types/lamoda"

const navigation: NavigationItem[] = [
  { name: "Главная", href: "/", icon: Home },
  { name: "Заказы", href: "/orders", icon: ShoppingCart },
  { name: "Логистика", href: "/logistics", icon: Truck },
  { name: "Товары", href: "/products", icon: Package },
  { name: "Акции", href: "/promotions", icon: Megaphone },
  { name: "Аналитика", href: "/analytics", icon: BarChart3 },
]

export function LamodaHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 lg:h-18 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <div className="flex items-center gap-3 md:gap-6">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    lamoda
                  </span>
                  <span className="text-sm md:text-base font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    seller
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || 
                    (item.href !== "/" && pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent group relative",
                        isActive 
                          ? "text-primary bg-primary/10 shadow-sm" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.name}
                      {isActive && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* User info - hidden on small screens */}
              <div className="hidden md:flex items-center gap-3 mr-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-foreground">mark mp cd</span>
                  <span className="text-xs text-muted-foreground">Продавец</span>
                </div>
                <Button variant="ghost" size="sm" className="h-10 px-2">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 md:h-10 md:w-10 hover:bg-accent"
                  title="Скачать отчеты"
                >
                  <Download className="h-4 w-4" />
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 md:h-10 md:w-10 hover:bg-accent relative"
                  title="Уведомления"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>
                
                {/* Mobile user menu */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-9 w-9 hover:bg-accent"
                  title="Профиль"
                >
                  <User className="h-4 w-4" />
                </Button>

                {/* Mobile menu button */}
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="lg:hidden h-9 w-9 hover:bg-accent"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title="Меню"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href !== "/" && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200",
                    isActive 
                      ? "text-primary bg-primary/10 shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              )
            })}
            
            {/* Mobile user section */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">mark mp cd</span>
                  <span className="text-xs text-muted-foreground">Продавец</span>
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
} 