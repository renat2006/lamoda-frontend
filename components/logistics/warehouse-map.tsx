"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { Warehouse } from '@/types/logistics'
import { cn } from '@/lib/utils'
import { MapPin, Phone, Clock, X } from 'lucide-react'
import { LamodaButton } from '@/components/ui/lamoda-button'

import 'mapbox-gl/dist/mapbox-gl.css'

interface WarehouseMapProps {
  warehouses: Warehouse[]
  selectedWarehouse?: Warehouse | null
  onWarehouseSelect?: (warehouse: Warehouse) => void
  className?: string
}

export function WarehouseMap({ 
  warehouses, 
  selectedWarehouse, 
  onWarehouseSelect,
  className 
}: WarehouseMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE

    if (!accessToken) {
      console.error('Mapbox access token not found')
      return
    }

    mapboxgl.accessToken = accessToken

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle || 'mapbox://styles/mapbox/light-v11',
      center: [37.6173, 55.7558], // Moscow center
      zoom: 9,
      attributionControl: false
    })

    map.current.on('load', () => {
      setIsLoading(false)
      
      // Add warehouses as markers
      addWarehouseMarkers()
      
      // Get user location
      getUserLocation()
    })

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.longitude, position.coords.latitude]
          setUserLocation(coords)
          
          // Add user location marker
          if (map.current) {
            const userMarker = document.createElement('div')
            userMarker.className = 'user-location-marker'
            userMarker.innerHTML = `
              <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
            `
            
            new mapboxgl.Marker({ element: userMarker })
              .setLngLat(coords)
              .addTo(map.current)
          }
        },
        (error) => {
          console.warn('Geolocation error:', error)
        }
      )
    }
  }

  const buildRoute = async (destination: [number, number]) => {
    if (!userLocation || !map.current) {
      alert('Местоположение не определено. Разрешите доступ к геолокации.')
      return
    }

    setRouteLoading(true)
    
    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation[0]},${userLocation[1]};${destination[0]},${destination[1]}?steps=true&geometries=geojson&access_token=${accessToken}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to get directions')
      }
      
      const data = await response.json()
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0]
        
        // Remove existing route
        if (map.current.getSource('route')) {
          map.current.removeLayer('route')
          map.current.removeSource('route')
        }
        
        // Add route to map
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        })
        
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#000000',
            'line-width': 4
          }
        })
        
        // Fit map to route
        const coordinates = route.geometry.coordinates
        const bounds = new mapboxgl.LngLatBounds()
        coordinates.forEach((coord: [number, number]) => bounds.extend(coord))
        map.current.fitBounds(bounds, { padding: 50 })
        
        // Show route info
        const distance = (route.distance / 1000).toFixed(1)
        const duration = Math.round(route.duration / 60)
        alert(`Маршрут построен: ${distance} км, примерно ${duration} мин`)
      }
    } catch (error) {
      console.error('Route building error:', error)
      alert('Не удалось построить маршрут')
    } finally {
      setRouteLoading(false)
    }
  }

  // Make buildRoute available globally for popup buttons
  useEffect(() => {
    (window as any).buildRoute = buildRoute
    return () => {
      delete (window as any).buildRoute
    }
  }, [userLocation])

  const addWarehouseMarkers = () => {
    if (!map.current) return

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    warehouses.forEach((warehouse, index) => {
      // Create custom marker element
      const markerElement = document.createElement('div')
      markerElement.className = 'warehouse-marker'
      markerElement.innerHTML = `
        <div class="relative">
          ${warehouse.status === 'active' ? 
            '<div class="absolute inset-0 w-8 h-8 bg-black rounded-full animate-ping opacity-20"></div>' : 
            ''
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl cursor-pointer ${
            warehouse.status === 'active' ? 'bg-black' :
            warehouse.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-400'
          }">
            ${index + 1}
          </div>
        </div>
      `

      // Create popup content
      const popupContent = `
        <div class="warehouse-popup">
          <div class="font-medium text-gray-900 mb-2">${warehouse.name}</div>
          <div class="text-sm text-gray-600 mb-2 flex items-center gap-1">
            <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            ${warehouse.address}
          </div>
          <div class="text-xs text-gray-500 mb-3">
            <div class="flex items-center gap-1 mb-1">
              <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ${warehouse.workingHours}
            </div>
            <div class="flex items-center gap-1">
              <svg class="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              ${warehouse.phone}
            </div>
          </div>
                     <div class="flex gap-2">
             <button 
               onclick="buildRoute([${warehouse.coordinates.lng}, ${warehouse.coordinates.lat}])"
               class="flex-1 px-3 py-1.5 bg-black text-white text-xs rounded hover:bg-gray-800 transition-colors"
             >
               Маршрут
             </button>
             <button 
               onclick="window.open('tel:${warehouse.phone}', '_self')"
               class="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 transition-colors"
             >
               Позвонить
             </button>
           </div>
        </div>
      `

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(popupContent)

      const marker = new mapboxgl.Marker({ element: markerElement })
        .setLngLat([warehouse.coordinates.lng, warehouse.coordinates.lat])
        .setPopup(popup)
        .addTo(map.current!)

      // Add click event
      markerElement.addEventListener('click', () => {
        if (onWarehouseSelect) {
          onWarehouseSelect(warehouse)
        }
      })

      markers.current.push(marker)
    })

    // Fit map to show all warehouses
    if (warehouses.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      warehouses.forEach(warehouse => {
        bounds.extend([warehouse.coordinates.lng, warehouse.coordinates.lat])
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }
  }

  useEffect(() => {
    if (map.current && !isLoading) {
      addWarehouseMarkers()
    }
  }, [warehouses, isLoading])

  return (
    <div className={cn("relative", className)}>
      <div 
        ref={mapContainer} 
        className="w-full h-64 rounded-lg overflow-hidden border bg-gray-50"
      />
      
      {isLoading && (
        <div className="absolute inset-0 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Загрузка карты...</p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <span className="text-gray-700">Активные</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">Техобслуживание</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-gray-700">Закрыт</span>
          </div>
        </div>
      </div>

      {/* Map controls */}
      <div className="absolute top-4 right-4 space-y-1">
        <button
          onClick={() => map.current?.zoomIn()}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded flex items-center justify-center hover:bg-white transition-colors"
        >
          <span className="text-lg leading-none">+</span>
        </button>
        <button
          onClick={() => map.current?.zoomOut()}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded flex items-center justify-center hover:bg-white transition-colors"
        >
          <span className="text-lg leading-none">−</span>
        </button>
        <button
          onClick={() => {
            if (map.current?.getSource('route')) {
              map.current.removeLayer('route')
              map.current.removeSource('route')
            }
          }}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded flex items-center justify-center hover:bg-white transition-colors"
          title="Очистить маршрут"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {routeLoading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm">
          Построение маршрута...
        </div>
      )}

      <style jsx global>{`
        .warehouse-popup {
          min-width: 220px;
        }
        .warehouse-marker {
          cursor: pointer;
        }
        .mapboxgl-popup-content {
          padding: 12px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .mapboxgl-popup-tip {
          border-top-color: white;
        }
      `}</style>
    </div>
  )
} 