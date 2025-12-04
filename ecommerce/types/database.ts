import type { Product, Order, OrderItem, PendingOrder } from './models'

export type Database = {
  public: {
    Tables: {
      products: {
        Row: Product
        Insert: Omit<Product, 'id' | 'created_at'>
        Update: Partial<Omit<Product, 'id' | 'created_at'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at'>
        Update: Partial<Omit<Order, 'id' | 'created_at'>>
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id'>
        Update: Partial<Omit<OrderItem, 'id'>>
      }
      pending_orders: {
        Row: PendingOrder
        Insert: Omit<PendingOrder, 'id' | 'created_at'>
        Update: Partial<Omit<PendingOrder, 'id' | 'created_at'>>
      }
    }
  }
}