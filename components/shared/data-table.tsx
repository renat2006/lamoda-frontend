"use client"

import { useState } from "react"
import { ChevronRight, Settings } from "lucide-react"
import { Button } from "@/components/ui"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  label: string
  width?: string
  render?: (value: unknown, item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
  className?: string
  showSettings?: boolean
}

export function DataTable<T extends object>({
  data,
  columns,
  loading = false,
  onRowClick,
  className,
  showSettings = true
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(columnKey)
      setSortDirection("asc")
    }
  }

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-background", className)}>
      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {/* Checkbox column */}
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  className="rounded border-input focus:ring-2 focus:ring-ring"
                />
              </th>
              
              {columns.map((column) => (
                <th 
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    column.width && `w-[${column.width}]`,
                    column.sortable && "cursor-pointer hover:text-foreground"
                  )}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <span className="text-primary">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}

              {/* Settings column */}
              {showSettings && (
                <th className="w-12 px-4 py-3">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Settings className="h-4 w-4" />
                  </Button>
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-border">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                  </td>
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </td>
                  ))}
                  {showSettings && (
                    <td className="px-4 py-3">
                      <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    </td>
                  )}
                </tr>
              ))
            ) : data.length > 0 ? (
              data.map((item, index) => (
                <tr 
                  key={index} 
                  className={cn(
                    "hover:bg-muted/50 transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  <td className="px-4 py-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-input focus:ring-2 focus:ring-ring"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  
                  {columns.map((column) => {
                    const value = String(column.key).includes('.') 
                      ? String(column.key).split('.').reduce((obj: unknown, key) => 
                          obj && typeof obj === 'object' && key in obj 
                            ? (obj as Record<string, unknown>)[key] 
                            : undefined, 
                          item
                        )
                      : item[column.key as keyof T]
                    
                    return (
                      <td key={String(column.key)} className="px-4 py-3 text-sm">
                        {column.render ? column.render(value, item) : String(value || "")}
                      </td>
                    )
                  })}

                  {showSettings && (
                    <td className="px-4 py-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td 
                  colSpan={columns.length + (showSettings ? 2 : 1)} 
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Нет данных для отображения
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
} 