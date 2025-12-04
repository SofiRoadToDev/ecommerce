import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/supabase/auth'
import { productSchema } from '@/lib/validations/product'

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate with Zod
    const validation = productSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      )
    }

    const productData = validation.data

    // Insert product
    // Workaround: Supabase types issue (see bugs_to_fix.md)
    const supabase = createAdminClient()
    const { data: product, error } = await (supabase
      .from('products') as any)
      .insert({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
        image_url: productData.image_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json(
        { error: 'Failed to create product', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ product }, { status: 201 })

  } catch (error) {
    console.error('POST /api/admin/products error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
