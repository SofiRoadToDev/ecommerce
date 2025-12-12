export interface Product {
  id: string
  created_at: string
  title: string
  slug: string
  description: string | null
  price: number
  image_url: string | null
  category: string // Deprecated: legacy string category
  category_id?: string | null // Foreign key to categories table
  category_data?: Category | null // Joined category data
  stock: number
}

export interface Category {
  id: string
  created_at: string
  name: string
  slug: string
}

export interface Branding {
  id: string
  created_at: string
  brand_name: string
  logo_url: string | null
  primary_color: string | null
  secondary_color: string | null
  contact_email: string | null
  contact_phone: string | null
  contact_address: string | null
}

export interface CartItem {
  id: string
  title: string
  price: number
  image_url: string | null
  category: string
  quantity: number
  stock: number
}

export interface Order {
  id: string
  created_at: string
  customer_email: string
  customer_name: string
  shipping_address: {
    address: string
    city: string
    postal_code: string
    country: string
  }
  total_amount: number
  status: OrderStatus
  payment_intent_id: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'ready_for_pickup' | 'completed' | 'cancelled'

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: Pick<Product, 'id' | 'title' | 'image_url'>
  })[]
}

export type PendingOrder = Order

