export interface Product {
  id: string
  created_at: string
  title: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  stock: number
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
  stripe_payment_id: string | null
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_purchase: number
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'ready_for_pickup' | 'completed'

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: Pick<Product, 'id' | 'title' | 'image_url'>
  })[]
}