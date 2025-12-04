/**
 * Admin email utilities
 * Functions for sending emails from admin panel
 */

import { sendOrderStatusEmail, OrderEmailData } from './send'

/**
 * Send order status update from admin panel
 */
export async function sendAdminOrderStatusUpdate(
  orderId: string,
  customerEmail: string,
  customerName: string,
  totalAmount: number,
  newStatus: string,
  previousStatus: string,
  items: Array<{ title: string; quantity: number; price: number }>,
  trackingNumber?: string,
  estimatedDelivery?: string
) {
  try {
    const emailData: OrderEmailData & { previousStatus: string } = {
      orderId,
      customerName,
      customerEmail,
      totalAmount,
      status: newStatus,
      previousStatus,
      items,
      trackingNumber,
      estimatedDelivery
    }

    const result = await sendOrderStatusEmail(emailData)
    
    console.log(`Admin order status email sent for order ${orderId}:`, result)
    return result
  } catch (error) {
    console.error(`Failed to send admin order status email for order ${orderId}:`, error)
    throw error
  }
}

/**
 * Test email templates from admin
 */
export async function testEmailTemplate(
  templateType: 'confirmed' | 'processing' | 'shipped' | 'ready_for_pickup',
  testEmail: string
) {
  try {
    const { sendOrderConfirmationEmail, sendOrderStatusEmail } = await import('./send')
    
    const testData = {
      orderId: 'TEST-123',
      customerName: 'Test User',
      customerEmail: testEmail,
      totalAmount: 99.99,
      status: templateType,
      items: [
        { title: 'Test Product 1', quantity: 1, price: 49.99 },
        { title: 'Test Product 2', quantity: 2, price: 25.00 }
      ]
    }

    let result
    if (templateType === 'confirmed') {
      result = await sendOrderConfirmationEmail(testData)
    } else {
      result = await sendOrderStatusEmail({
        ...testData,
        previousStatus: 'confirmed'
      })
    }

    console.log(`Test email sent for template ${templateType}:`, result)
    return result
  } catch (error) {
    console.error(`Failed to send test email for template ${templateType}:`, error)
    throw error
  }
}