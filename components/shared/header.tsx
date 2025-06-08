"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  BarChart3,
  FileText,
  HelpCircle,
  BookOpen,
  Megaphone,
  Zap,
  TrendingUp,
  AlertTriangle,
  Plus,
  Truck
} from "lucide-react"
import { Button } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useUser } from "@/hooks/use-user"
import { authService } from "@/lib/auth"

// Основная навигация для десктопа
const mainNavigation = [
  {
    name: "Главная",
    href: "/",
    icon: Home,
    description: "Обзор бизнеса и важные уведомления"
  },
  {
    name: "Заказы",
    href: "/orders", 
    icon: ShoppingCart,
    badge: 5,
    description: "Управление заказами и отгрузками",
    urgent: true
  },
  {
    name: "Товары",
    href: "/products",
    icon: Package,
    badge: 12,
    description: "Каталог товаров и карточки"
  },
  {
    name: "Логистика",
    href: "/logistics",
    icon: Truck,
    badge: 3,
    description: "Склады, отгрузки и доставка"
  },
  {
    name: "Аналитика",
    href: "/analytics",
    icon: BarChart3, 
    description: "Продажи, конверсия и отчеты"
  }
]

// Дополнительная навигация
const secondaryNavigation = [
  {
    name: "Документы",
    href: "/documents",
    icon: FileText,
    description: "Договоры, акты, отчеты"
  },
  {
    name: "Маркетинг",
    href: "/marketing", 
    icon: Megaphone,
    description: "Акции, промокоды, реклама"
  },
  {
    name: "Помощь",
    href: "/help",
    icon: HelpCircle,
    description: "FAQ, обучение, поддержка"
  }
]

// Быстрые действия
const quickActions = [
  {
    name: "Добавить товар",
    href: "/products/new",
    icon: Package,
    color: "bg-blue-500"
  },
  {
    name: "Создать акцию", 
    href: "/marketing/new",
    icon: Zap,
    color: "bg-purple-500"
  },
  {
    name: "Посмотреть отчеты",
    href: "/analytics/reports",
    icon: TrendingUp,
    color: "bg-emerald-500"
  }
]

interface NavItemProps {
  item: typeof mainNavigation[0]
  isActive: boolean
  onClick?: () => void
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const Icon = item.icon
  
  return (
            <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        isActive 
          ? "bg-primary/5 text-primary shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
      )}
    >
      <div className="relative">
        <Icon className="h-5 w-5" />
        {item.badge && (
          <Badge 
            variant={item.urgent ? "destructive" : "secondary"}
            className={cn(
              "absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs font-medium",
              item.urgent && "animate-pulse"
            )}
          >
            {item.badge}
          </Badge>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium transition-colors",
          isActive ? "text-primary" : "text-gray-900"
        )}>
          {item.name}
        </div>
        <div className="text-xs text-gray-500 mt-0.5 hidden lg:block">
          {item.description}
        </div>
      </div>
      
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}
    </Link>
  )
}

interface NotificationProps {
  id: string
  title: string
  message: string
  urgent: boolean
  time: string
}

const mockNotifications: NotificationProps[] = [
  {
    id: "1",
    title: "Срочные заказы",
    message: "12 заказов требуют обработки до 18:00",
    urgent: true,
    time: "5 мин назад"
  },
  {
    id: "2", 
    title: "Модерация товаров",
    message: "3 товара одобрены, 1 отклонён",
    urgent: false,
    time: "1 час назад"
  },
  {
    id: "3",
    title: "Низкие остатки",
    message: "У 5 товаров заканчиваются остатки",
    urgent: true,
    time: "2 часа назад"
  }
]

function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  
  return (
    <div className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
        <input
          type="text"
          placeholder="Поиск товаров, заказов..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-none text-sm placeholder:text-foreground/40 focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
      
      {/* Mobile Search Results */}
      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-border z-40 max-h-96 overflow-y-auto">
          <div className="p-4 space-y-3">
            <div className="text-xs font-medium text-foreground/40 uppercase tracking-wider">
              Быстрые действия
            </div>
            <Link href="/products/new" className="flex items-center gap-3 p-3 active:bg-muted/50 transition-colors">
              <Plus className="h-5 w-5 text-foreground/40" />
              <span className="text-sm text-foreground">Добавить товар</span>
            </Link>
            <Link href="/orders" className="flex items-center gap-3 p-3 active:bg-muted/50 transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground/40" />
              <span className="text-sm text-foreground">Новые заказы</span>
            </Link>
            {query && (
              <>
                <div className="text-xs font-medium text-foreground/40 uppercase tracking-wider mt-4">
                  Результаты поиска
                </div>
                <div className="text-sm text-foreground/60 p-3">
                  Поиск по запросу "{query}"...
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Overlay for mobile search */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const urgentCount = mockNotifications.filter(n => n.urgent).length

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 hover:bg-accent/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-foreground/60" />
        {urgentCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-xs font-medium animate-pulse"
          >
            {urgentCount}
          </Badge>
        )}
        <span className="sr-only">
          Уведомления{urgentCount > 0 ? ` (${urgentCount} важных)` : ''}
        </span>
      </Button>

      {isOpen && (
        <>
          {/* Mobile Full Screen Notifications */}
          <div className="md:hidden fixed inset-0 bg-white z-50">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-medium text-foreground">Уведомления</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className={cn(
                  "p-4 border border-border transition-colors active:bg-muted/50",
                  notification.urgent && "border-l-4 border-l-primary bg-primary/5"
                )}>
                  <div className="flex items-start gap-3">
                    {notification.urgent && (
                      <AlertTriangle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm mb-1">
                        {notification.title}
                      </div>
                      <div className="text-sm text-foreground/60 mb-2">
                        {notification.message}
                      </div>
                      <div className="text-xs text-foreground/40">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:block absolute top-full right-0 mt-2 w-80 bg-white border border-border shadow-lg z-50">
            <div className="p-4 border-b border-border">
              <h3 className="font-medium text-foreground">Уведомления</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {mockNotifications.map((notification) => (
                <div key={notification.id} className={cn(
                  "p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer",
                  notification.urgent && "border-l-4 border-l-primary bg-primary/5"
                )}>
                  <div className="flex items-start gap-3">
                    {notification.urgent && (
                      <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-foreground text-sm">
                        {notification.title}
                      </div>
                      <div className="text-xs text-foreground/60 mt-1">
                        {notification.message}
                      </div>
                      <div className="text-xs text-foreground/40 mt-2">
                        {notification.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay for desktop */}
          <div 
            className="hidden md:block fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useUser()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  
  return (
    <div className="relative">
      <Button
        variant="ghost" 
        size="sm"
        className="flex items-center gap-2 h-10 px-0 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-foreground flex items-center justify-center">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="text-left hidden md:block">
          {isLoading ? (
            <>
              <div className="w-20 h-4 bg-muted animate-pulse rounded mb-1" />
              <div className="w-12 h-3 bg-muted animate-pulse rounded" />
            </>
          ) : (
            <>
              <div className="text-sm font-medium text-foreground">
                {user?.company_name || 'Загрузка...'}
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                {user?.inn || '...'}
              </div>
            </>
          )}
        </div>
        <ChevronDown className="h-3 w-3 text-foreground/40 hidden md:block" />
      </Button>

      {isOpen && (
        <>
          {/* Mobile Dropdown */}
          <div className="md:hidden fixed inset-x-0 top-16 bg-white border-b border-border z-40">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {user?.company_name || 'Загрузка...'}
                  </div>
                  <div className="text-sm text-foreground/40">
                    {user?.inn || '...'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Link href="/profile" className="flex items-center gap-4 p-4 active:bg-muted/50 transition-colors">
                <User className="h-5 w-5 text-foreground/40" />
                <span className="text-foreground">Профиль</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-4 p-4 active:bg-muted/50 transition-colors">
                <Settings className="h-5 w-5 text-foreground/40" />
                <span className="text-foreground">Настройки</span>
              </Link>
              <Link href="/help" className="flex items-center gap-4 p-4 active:bg-muted/50 transition-colors">
                <BookOpen className="h-5 w-5 text-foreground/40" />
                <span className="text-foreground">Помощь</span>
              </Link>
              <div className="border-t border-border mt-4 pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 active:bg-muted/50 transition-colors w-full text-left"
                >
                  <LogOut className="h-5 w-5 text-foreground/40" />
                  <span className="text-foreground">Выйти</span>
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Dropdown */}
          <div className="hidden md:block absolute right-0 top-full mt-2 w-72 bg-white border border-border rounded-lg shadow-lg z-50">
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-foreground flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {user?.company_name || 'Загрузка...'}
                  </div>
                  <div className="text-sm text-foreground/40">
                    {user?.inn || '...'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <Link href="/profile" className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <User className="h-4 w-4 text-foreground/40" />
                <span className="text-sm text-foreground">Профиль</span>
              </Link>
              <Link href="/settings" className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <Settings className="h-4 w-4 text-foreground/40" />
                <span className="text-sm text-foreground">Настройки</span>
              </Link>
              <Link href="/help" className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <BookOpen className="h-4 w-4 text-foreground/40" />
                <span className="text-sm text-foreground">Помощь</span>
              </Link>
            </div>
            <div className="p-2 border-t border-border">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors w-full text-left"
              >
                <LogOut className="h-4 w-4 text-foreground/40" />
                <span className="text-sm text-foreground">Выйти</span>
              </button>
            </div>
          </div>

          {/* Overlay for desktop */}
          <div 
            className="hidden md:block fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  )
}

function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  
  const currentPage = [...mainNavigation, ...secondaryNavigation].find(
    item => pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  )
  
  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-full">
          {/* Logo + Page Title */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Link href="/" className="flex items-center justify-center flex-shrink-0">
              <img 
                src="/logo.svg" 
                alt="Lamoda" 
                className="h-16 w-auto max-w-[160px] object-contain" 
              />
            </Link>
            {currentPage?.name && currentPage.name !== "Lamoda" && (
              <div className="min-w-0 flex-1 pl-2">
                <div className="font-medium text-foreground text-sm truncate">
                  {currentPage.name}
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-accent/50 transition-colors"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5 text-foreground" />
              <span className="sr-only">Меню</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white shadow-xl border-l border-border">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Меню</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-accent/50 transition-colors" 
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Закрыть меню</span>
              </Button>
            </div>
            
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="p-4 space-y-6 flex-1">
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Основное</h3>
                  <div className="space-y-1">
                    {mainNavigation.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      return (
                        <NavItem 
                          key={item.href} 
                          item={item} 
                          isActive={isActive}
                          onClick={() => setIsMenuOpen(false)}
                        />
                      )
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Дополнительно</h3>
                  <div className="space-y-1">
                    {secondaryNavigation.map((item) => {
                      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                      return (
                        <NavItem 
                          key={item.href} 
                          item={item} 
                          isActive={isActive}
                          onClick={() => setIsMenuOpen(false)}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
              
              {/* Notifications Section */}
              <div className="p-4 border-t border-border">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Уведомления</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {mockNotifications.slice(0, 3).map((notification) => (
                    <div key={notification.id} className={cn(
                      "p-3 rounded-lg border transition-colors",
                      notification.urgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
                    )}>
                      <div className="flex items-start gap-2">
                        {notification.urgent && (
                          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground truncate">
                            {notification.title}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Profile Section */}
              <div className="p-4 border-t border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{user?.company_name || 'Загрузка...'}</div>
                    <div className="text-xs text-muted-foreground">ИНН {user?.inn || '...'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8" asChild>
                    <Link href="/profile">
                      <Settings className="h-3 w-3 mr-1" />
                      Профиль
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-8"
                    onClick={async () => {
                      try {
                        await authService.logout()
                      } catch (error) {
                        console.error('Logout failed:', error)
                      }
                    }}
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Выйти
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function DesktopHeader() {
  const pathname = usePathname()
  
  return (
    <div className="hidden md:block">
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="Lamoda" 
                className="h-20 w-auto max-w-[180px] object-contain" 
              />
            </Link>
            
            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative text-sm font-medium transition-all duration-150 uppercase tracking-wider border-b-2 pb-1",
                      isActive 
                        ? "text-foreground border-foreground" 
                        : "text-foreground/40 border-transparent hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {item.name}
                      {item.badge && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                    </div>
                  </Link>
                )
              })}
          </nav>
            
            {/* Actions */}
            <div className="flex items-center gap-2">
              <NotificationsDropdown />
              <UserMenu />
            </div>
        </div>
      </div>
    </header>
    </div>
  )
}

export function Header() {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  )
} 