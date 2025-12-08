import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isAdmin } from '@/lib/supabase/auth'
import { updateOrderStatusSchema } from '@/lib/validations/order'
import { z } from 'zod'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authorization
    if (!(await isAdmin())) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Admin access required'
          }
        },
        { status: 401 }
      )
    }

    const { id: orderId } = await params

    // Validate order ID format
    if (!orderId || orderId.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ORDER_ID',
            message: 'Invalid order ID format'
          }
        },
        { status: 400 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = updateOrderStatusSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: validation.error.errors
          }
        },
        { status: 400 }
      )
    }

    const { status: newStatus } = validation.data

    // Update order status in database
    const supabase = createAdminClient()

    // Workaround: Supabase types issue (see bugs_to_fix.md)
    const { data: order, error: updateError } = await (supabase
      .from('orders') as any)
      .update({ status: newStatus })
      .eq('id', orderId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating order status:', updateError)
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UPDATE_FAILED',
            message: 'Failed to update order status',
            details: updateError.message
          }
        },
        { status: 500 }
      )
    }

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found'
          }
        },
        { status: 404 }
      )
    }

    // Database trigger will automatically send email notification
    return NextResponse.json({
      success: true,
      data: {
        order,
        message: 'Order status updated successfully. Customer will receive an email notification.'
      }
    })
  } catch (error) {
    console.error('Error in status update API:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An unexpected error occurred'
        }
      },
      { status: 500 }
    )
  }
}
