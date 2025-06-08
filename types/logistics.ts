export interface TimeSlot {
  id: string
  date: string
  time: string
  warehouse: string
  type: 'FBO' | 'FBS' | 'DBS'
  available: boolean
  reserved?: boolean
}

export interface Shipment {
  id: string
  tracking: string
  status: 'waiting' | 'ready' | 'in_transit' | 'delivered' | 'cancelled'
  warehouse: string
  destination: string
  items: number
  created: string
  delivery_date?: string
  type: 'FBO' | 'FBS' | 'DBS'
}

export interface Warehouse {
  id: string
  name: string
  address: string
  phone: string
  workingHours: string
  coordinates: { lat: number, lng: number }
  services: string[]
  status: 'active' | 'maintenance' | 'closed'
} 