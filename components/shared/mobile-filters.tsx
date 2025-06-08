"use client"

import { useState, useEffect } from "react"
import { 
  Filter,
  Search,
  X,
  ChevronDown,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui"
import { formatCurrency, formatNumber } from '@/lib/format-utils'
// Простые утилиты
const cn = (...classes: (string | undefined | false)[]) => classes.filter(Boolean).join(' ')
const hapticFeedback = (type: 'light' | 'medium') => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    const patterns = { light: 10, medium: 20 }
    navigator.vibrate(patterns[type])
  }
}

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface FilterSection {
  id: string
  title: string
  type: 'select' | 'multi-select' | 'range' | 'date' | 'search'
  icon?: React.ComponentType<{ className?: string }>
  options?: FilterOption[]
  min?: number
  max?: number
  placeholder?: string
}

interface MobileFiltersProps {
  sections: FilterSection[]
  onApply: (filters: Record<string, unknown>) => void
  onReset: () => void
  className?: string
}

// Предопределенные секции фильтров для заказов
export const orderFilterSections: FilterSection[] = [
  {
    id: 'status',
    title: 'Статус заказа',
    type: 'multi-select',
    icon: CheckCircle,
    options: [
      { label: 'Новые', value: 'new', count: 24 },
      { label: 'В обработке', value: 'processing', count: 12 },
      { label: 'Отгружены', value: 'shipped', count: 156 },
      { label: 'Доставлены', value: 'delivered', count: 892 },
      { label: 'Отменены', value: 'cancelled', count: 3 }
    ]
  },
  {
    id: 'dateRange',
    title: 'Период заказа',
    type: 'date',
    icon: Calendar
  },
  {
    id: 'amountRange',
    title: 'Сумма заказа',
    type: 'range',
    icon: DollarSign,
    min: 0,
    max: 100000
  },
  {
    id: 'customer',
    title: 'Поиск по клиенту',
    type: 'search',
    placeholder: 'Имя, email, телефон...'
  }
]

// Предопределенные секции фильтров для товаров
export const productFilterSections: FilterSection[] = [
  {
    id: 'status',
    title: 'Статус товара',
    type: 'multi-select',
    icon: Tag,
    options: [
      { label: 'Активные', value: 'active', count: 156 },
      { label: 'На модерации', value: 'moderation', count: 23 },
      { label: 'Черновики', value: 'draft', count: 8 },
      { label: 'Неактивные', value: 'inactive', count: 45 },
      { label: 'Отклоненные', value: 'rejected', count: 12 }
    ]
  },
  {
    id: 'category',
    title: 'Категория',
    type: 'select',
    options: [
      { label: 'Одежда', value: 'clothing' },
      { label: 'Обувь', value: 'shoes' },
      { label: 'Аксессуары', value: 'accessories' },
      { label: 'Сумки', value: 'bags' }
    ]
  },
  {
    id: 'priceRange',
    title: 'Цена',
    type: 'range',
    icon: DollarSign,
    min: 0,
    max: 50000
  },
  {
    id: 'brand',
    title: 'Поиск по бренду',
    type: 'search',
    placeholder: 'Название бренда...'
  }
]

export function MobileFilters({ sections, onApply, onReset, className }: MobileFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<Record<string, unknown>>({})
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key] !== undefined && 
    filters[key] !== null && 
    filters[key] !== '' &&
    (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
  ).length

  const handleFilterChange = (sectionId: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [sectionId]: value
    }))
  }

  const handleToggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
    hapticFeedback('light')
  }

  const handleApply = () => {
    onApply(filters)
    setIsOpen(false)
    hapticFeedback('medium')
  }

  const handleReset = () => {
    setFilters({})
    onReset()
    hapticFeedback('light')
  }

  const handleClose = () => {
    setIsOpen(false)
    hapticFeedback('light')
  }

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      {/* Filter trigger button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn("relative", className)}
      >
        <Filter className="h-4 w-4 mr-2" />
        Фильтры
        {activeFiltersCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-full duration-300">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Фильтры</h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary/10 text-primary text-sm font-medium px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-4 space-y-6 max-h-[calc(100vh-200px)]">
              {sections.map((section) => (
                <FilterSection
                  key={section.id}
                  section={section}
                  value={filters[section.id]}
                  isExpanded={expandedSections.includes(section.id)}
                  onToggle={() => handleToggleSection(section.id)}
                  onChange={(value) => handleFilterChange(section.id, value)}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-6 border-t border-border bg-background/80 backdrop-blur-sm">
              <Button
                variant="outline"
                onClick={handleReset}
                className="flex-1"
                disabled={activeFiltersCount === 0}
              >
                Сбросить
              </Button>
              <Button
                onClick={handleApply}
                className="flex-1"
              >
                Применить {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Компонент отдельной секции фильтра
interface FilterSectionProps {
  section: FilterSection
  value: unknown
  isExpanded: boolean
  onToggle: () => void
  onChange: (value: unknown) => void
}

function FilterSection({ section, value, isExpanded, onToggle, onChange }: FilterSectionProps) {
  const Icon = section.icon
  
  const renderFilterContent = () => {
    switch (section.type) {
      case 'search':
        return (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <input
               type="text"
               placeholder={section.placeholder}
               value={(value as string) || ''}
               onChange={(e) => onChange(e.target.value)}
               className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
             />
          </div>
        )
      
      case 'select':
        return (
          <div className="space-y-2">
            {section.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={section.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => onChange(e.target.value)}
                  className="sr-only"
                />
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 transition-colors",
                  value === option.value 
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground"
                )}>
                  {value === option.value && (
                    <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {option.label}
                </span>
                {option.count && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        )
      
      case 'multi-select':
        const selectedValues = Array.isArray(value) ? value : []
        return (
          <div className="space-y-2">
            {section.options?.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter(v => v !== option.value)
                    onChange(newValues)
                  }}
                  className="sr-only"
                />
                <div className={cn(
                  "w-4 h-4 rounded border-2 transition-colors flex items-center justify-center",
                  selectedValues.includes(option.value)
                    ? "border-primary bg-primary" 
                    : "border-muted-foreground"
                )}>
                  {selectedValues.includes(option.value) && (
                    <CheckCircle className="h-3 w-3 text-primary-foreground" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium text-foreground">
                  {option.label}
                </span>
                {option.count && (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {option.count}
                  </span>
                )}
              </label>
            ))}
          </div>
        )
      
      case 'range':
        const [min, max] = Array.isArray(value) ? value : [section.min, section.max]
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="От"
                value={min || ''}
                onChange={(e) => onChange([Number(e.target.value) || section.min, max])}
                className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <span className="text-muted-foreground">—</span>
              <input
                type="number"
                placeholder="До"
                value={max || ''}
                onChange={(e) => onChange([min, Number(e.target.value) || section.max])}
                className="flex-1 px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>От {formatCurrency(section.min || 0)}</span>
                <span>До {formatCurrency(section.max || 0)}</span>
            </div>
          </div>
        )
      
      case 'date':
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-2">От</label>
                               <input
                 type="date"
                 value={(value as { from?: string })?.from || ''}
                 onChange={(e) => onChange({ ...(value as { from?: string; to?: string }), from: e.target.value })}
                 className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
               />
             </div>
             <div>
               <label className="block text-xs font-medium text-muted-foreground mb-2">До</label>
               <input
                 type="date"
                 value={(value as { to?: string })?.to || ''}
                 onChange={(e) => onChange({ ...(value as { from?: string; to?: string }), to: e.target.value })}
                 className="w-full px-3 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
               />
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
          <span className="font-medium text-foreground">{section.title}</span>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-muted-foreground transition-transform",
          isExpanded && "rotate-180"
        )} />
      </button>
      
      {isExpanded && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          {renderFilterContent()}
        </div>
      )}
    </div>
  )
} 