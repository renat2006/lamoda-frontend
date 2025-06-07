"use client"

import { useState } from "react"
import { CalendarDays, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface FiltersProps {
  onSearch?: (query: string) => void
  searchPlaceholder?: string
  className?: string
}

export function Filters({ 
  onSearch, 
  searchPlaceholder = "Поиск...",
  className 
}: FiltersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <FilterDropdown label="Страна" defaultValue="Все страны" />
        <FilterDropdown label="Статус заказа" defaultValue="Все" />
        <DateRangeFilter />
      </div>
    </div>
  )
}

interface FilterDropdownProps {
  label: string
  defaultValue: string
}

function FilterDropdown({ label, defaultValue }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected] = useState(defaultValue)

  return (
    <div className="relative">
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between min-w-[100px] md:min-w-[120px] px-2 md:px-3 py-2 border border-input rounded-md bg-background text-xs md:text-sm hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <span>{selected}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      
      {/* Dropdown content would go here */}
    </div>
  )
}

function DateRangeFilter() {
  return (
    <div className="flex items-center gap-2">
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Дата заказа</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="21.04.25"
              className="w-24 px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <CalendarDays className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">До</span>
          <div className="relative">
            <input
              type="text"
              placeholder="Дата"
              className="w-24 px-3 py-2 border border-input rounded-md bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <CalendarDays className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}

// Чекбокс для дополнительных фильтров
export function FilterCheckbox({ 
  label, 
  checked, 
  onChange 
}: { 
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void 
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="rounded border-input focus:ring-2 focus:ring-ring"
      />
      <span>{label}</span>
    </label>
  )
} 