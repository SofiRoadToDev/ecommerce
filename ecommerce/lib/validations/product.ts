import { z } from 'zod'

/**
 * Product validation schemas
 * Used for admin product CRUD operations
 */

// Available product categories
export const PRODUCT_CATEGORIES = [
  'electronics',
  'clothing',
  'books',
  'home',
  'sports',
  'toys',
  'other'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]

/**
 * Base product schema for database operations
 */
export const productSchema = z.object({
  title: z.string()
    .min(1, { message: 'admin.products.titleRequired' })
    .min(3, { message: 'admin.products.titleTooShort' })
    .max(200, { message: 'admin.products.titleTooLong' }),

  description: z.string()
    .min(1, { message: 'admin.products.descriptionRequired' })
    .min(10, { message: 'admin.products.descriptionTooShort' })
    .max(2000, { message: 'admin.products.descriptionTooLong' }),

  price: z.number()
    .min(0.01, { message: 'admin.products.priceInvalid' })
    .max(999999.99, { message: 'admin.products.priceTooHigh' }),

  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: 'admin.products.categoryInvalid' })
  }),

  stock: z.number()
    .int({ message: 'admin.products.stockMustBeInteger' })
    .min(0, { message: 'admin.products.stockNegative' })
    .max(999999, { message: 'admin.products.stockTooHigh' }),

  image_url: z.string()
    .url({ message: 'admin.products.imageUrlInvalid' })
    .optional()
    .or(z.literal(''))
})

/**
 * Form schema for client-side validation
 * Accepts string values that will be parsed
 */
export const productFormSchema = z.object({
  title: z.string()
    .min(1, { message: 'admin.products.titleRequired' })
    .min(3, { message: 'admin.products.titleTooShort' })
    .max(200, { message: 'admin.products.titleTooLong' }),

  description: z.string()
    .min(1, { message: 'admin.products.descriptionRequired' })
    .min(10, { message: 'admin.products.descriptionTooShort' })
    .max(2000, { message: 'admin.products.descriptionTooLong' }),

  // Accept string input, will be coerced to number
  price: z.string()
    .min(1, { message: 'admin.products.priceRequired' })
    .transform((val) => parseFloat(val))
    .pipe(
      z.number()
        .min(0.01, { message: 'admin.products.priceInvalid' })
        .max(999999.99, { message: 'admin.products.priceTooHigh' })
    ),

  category: z.enum(PRODUCT_CATEGORIES, {
    errorMap: () => ({ message: 'admin.products.categoryInvalid' })
  }),

  // Accept string input, will be coerced to number
  stock: z.string()
    .min(1, { message: 'admin.products.stockRequired' })
    .transform((val) => parseInt(val, 10))
    .pipe(
      z.number()
        .int({ message: 'admin.products.stockMustBeInteger' })
        .min(0, { message: 'admin.products.stockNegative' })
        .max(999999, { message: 'admin.products.stockTooHigh' })
    ),

  image_url: z.string()
    .url({ message: 'admin.products.imageUrlInvalid' })
    .optional()
    .or(z.literal(''))
})

/**
 * Inferred types
 */
export type ProductFormData = z.infer<typeof productFormSchema>
export type ProductData = z.infer<typeof productSchema>
