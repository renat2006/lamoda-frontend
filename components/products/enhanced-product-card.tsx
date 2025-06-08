"use client"

import { useState } from "react"
import { Edit2, Trash2, Copy, Package, Eye, TrendingUp, Star } from "lucide-react"
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
  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-300 rounded-lg overflow-hidden transition-all duration-200 h-[360px] flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-50">
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
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-1"
          />
        </div>

        {/* Stock status */}
        {!product.in_stock && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-md font-medium">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col min-w-0">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product name */}
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Category */}
        <p className="text-xs text-gray-500 mb-3">
          {product.category}
        </p>

        {/* Price */}
        <div className="mt-auto">
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {product.price?.toLocaleString()} ₽
          </p>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="flex-1 min-w-0 px-2 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 truncate"
            >
              Изменить
            </button>
            <button
              onClick={onDelete}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-150"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EnhancedProductListCard({ product, isSelected, onSelect, onEdit, onDelete }: ProductCardProps) {
  return (
    <div className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors duration-150">
      <div className="flex items-center gap-4 p-4">
        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black focus:ring-1 flex-shrink-0"
        />

        {/* Image */}
        <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
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
        <div className="flex-1 min-w-0 flex items-center justify-between">
          {/* Product info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-medium text-gray-900 truncate text-sm">
                {product.name}
              </h3>
              {product.brand && (
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {product.brand}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="font-semibold text-gray-900">
                {product.price?.toLocaleString()} ₽
              </span>
              <span className="text-gray-500">
                {product.category}
              </span>
              {!product.in_stock && (
                <span className="text-red-600 text-xs font-medium">
                  Нет в наличии
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150 whitespace-nowrap"
            >
              Изменить
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 rounded-md transition-colors duration-150 flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 