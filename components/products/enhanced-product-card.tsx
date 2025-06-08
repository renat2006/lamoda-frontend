"use client"

import { useState, useEffect, useRef } from "react"
import { Edit2, Trash2, Copy, Package, Eye, MoreVertical } from "lucide-react"
import { LamodaButton } from "@/components/ui/lamoda-button"
import { Badge } from "@/components/ui/badge"
import { Product } from "@/lib/api/products"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function EnhancedProductCard({ product, isSelected, onSelect, onEdit, onDelete }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden transition-all duration-200 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsActive(false)
      }}
    >
      {/* Image Section */}
      <div className="relative aspect-square bg-gray-50">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-300" />
          </div>
        )}

        {/* Selection checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-1"
          />
        </div>

        {/* Stock status */}
        {!product.in_stock && (
          <div className="absolute top-2 right-2 z-10">
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md font-medium">
              Нет в наличии
            </span>
          </div>
        )}

        {/* Menu button - visible on mobile */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsActive(!isActive)
          }}
          className={cn(
            "absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm",
            "md:hidden", // Hide on desktop
            "active:scale-95 transition-transform"
          )}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </button>

        {/* Quick actions overlay - visible on hover for desktop, on click for mobile */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/40 transition-opacity duration-200 flex items-center justify-center gap-2",
            "md:opacity-0 md:group-hover:opacity-100", // Desktop: show on hover
            isActive ? "opacity-100" : "opacity-0" // Mobile: show on click
          )}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-white/20 hover:bg-white/30 rounded-md backdrop-blur-sm transition-colors duration-150 active:scale-95"
          >
            Изменить
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="px-3 py-1.5 text-xs font-medium text-white bg-red-500/20 hover:bg-red-500/30 rounded-md backdrop-blur-sm transition-colors duration-150 active:scale-95"
          >
            Удалить
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 truncate">
            {product.brand}
          </p>
        )}

        {/* Product name */}
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-tight">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-2 truncate">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-base font-semibold text-gray-900">
            {product.price?.toLocaleString()} ₽
          </p>
        </div>
      </div>
    </div>
  )
}

export function EnhancedProductListCard({ product, isSelected, onSelect, onEdit, onDelete }: ProductCardProps) {
  const [isActive, setIsActive] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setIsActive(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div 
      ref={cardRef}
      className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-150"
    >
      <div className="flex items-center gap-3 p-3">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation()
            onSelect()
          }}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-1 flex-shrink-0"
        />

        {/* Image */}
        <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3">
          {/* Product info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-gray-900 truncate text-sm">
                {product.name}
              </h3>
              {product.brand && (
                <span className="text-xs text-gray-500 uppercase tracking-wide flex-shrink-0">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold text-gray-900">
                {product.price?.toLocaleString()} ₽
              </span>
              <span className="text-gray-500 truncate">
                {product.category}
              </span>
              {!product.in_stock && (
                <span className="text-red-600 text-xs font-medium flex-shrink-0">
                  Нет в наличии
                </span>
              )}
            </div>
          </div>

          {/* Menu button - visible on mobile */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsActive(!isActive)
            }}
            className={cn(
              "p-2 rounded-full bg-gray-100",
              "md:hidden", // Hide on desktop
              "active:scale-95 transition-transform"
            )}
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {/* Actions */}
          <div className={cn(
            "flex items-center gap-1.5 flex-shrink-0 transition-opacity duration-200",
            isActive ? "opacity-100" : "opacity-0 md:opacity-100"
          )}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 active:scale-95"
            >
              Изменить
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-red-600 rounded-md transition-colors duration-150 active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 