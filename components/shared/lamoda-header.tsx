"use client"

import { Bell, Menu, Search, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface LamodaHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function LamodaHeader({ onMenuClick, showMenuButton = true }: LamodaHeaderProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-3 lg:hidden hover:bg-accent/50 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Открыть меню</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary italic transform -skew-x-12">
                      la
                    </span>
                    <span className="text-lg font-medium text-foreground">
                      seller
                    </span>
                  </div>
                </div>
                {/* Мобильная навигация будет добавлена позже */}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary italic transform -skew-x-12 transition-transform hover:scale-105">
              la
            </span>
            <span className="text-lg font-medium text-foreground hidden sm:inline-block">
              seller
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4">
          {/* Search (Desktop) */}
          <div className="hidden lg:flex">
            <Button
              variant="outline"
              size="sm"
              className="w-56 justify-start text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
              <Search className="mr-2 h-4 w-4" />
              Поиск...
            </Button>
          </div>

          {/* Search (Mobile) */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden hover:bg-accent/50 transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Поиск</span>
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-accent/50 transition-colors"
            >
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
              >
                3
              </Badge>
              <span className="sr-only">Уведомления</span>
            </Button>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:bg-accent/50 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="sr-only">Профиль</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Иван Продавцов</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    ivan@seller.lamoda.ru
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Профиль</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Настройки</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
} 