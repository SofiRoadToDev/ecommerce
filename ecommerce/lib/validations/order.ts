import { z } from 'zod'

export const orderStatusSchema = z.enum([
  'pending',
  'paid',
  'processing',
  'shipped',
  'ready_for_pickup',
  'completed',
  'cancelled'
])

export type OrderStatus = z.infer<typeof orderStatusSchema>

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema
})

export const orderFilterSchema = z.object({
  status: orderStatusSchema.optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(20)
})

export type OrderFilter = z.infer<typeof orderFilterSchema>

export const shippingAddressSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional()
})

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export const createOrderSchema = z.object({
  customer_email: z.string().email('Invalid email address'),
  customer_name: z.string().min(1, 'Name is required'),
  shipping_address: shippingAddressSchema,
  items: z.array(z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive()
  })).min(1, 'At least one item is required')
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
