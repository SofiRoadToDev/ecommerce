/**
 * Email sending utility using Resend API
 * Handles transactional emails for order notifications
 */

import { Resend } from 'resend'
import { 
  orderConfirmedTemplate, 
  orderProcessingTemplate, 
  orderShippedTemplate, 
  orderReadyForPickupTemplate,
  OrderEmailData 
} from './templates'

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Email configuration
 */
const EMAIL_CONFIG = {
  from: process.env.FROM_EMAIL || 'noreply@yourstore.com',
  fromName: process.env.FROM_NAME || 'Your Store',
  replyTo: process.env.REPLY_TO_EMAIL || 'support@yourstore.com'
}

/**
 * Send order confirmation email
 */
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    const { subject, html } = orderConfirmedTemplate(data)
    
    const { data: emailData, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: data.customerEmail,
      subject,
      html,
      replyTo: EMAIL_CONFIG.replyTo
    })

    if (error) {
      console.error('Error sending order confirmation email:', error)
      throw new Error(`Failed to send confirmation email: ${error.message}`)
    }

    console.log('Order confirmation email sent:', emailData?.id)
    return emailData
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error)
    throw error
  }
}

/**
 * Send order status update email
 */
export async function sendOrderStatusEmail(data: OrderEmailData & { previousStatus: string }) {
  try {
    let template
    let subject

    switch (data.status) {
      case 'processing':
        template = orderProcessingTemplate(data)
        break
      case 'shipped':
        template = orderShippedTemplate(data)
        break
      case 'ready_for_pickup':
        template = orderReadyForPickupTemplate(data)
        break
      default:
        console.log(`No email template for status: ${data.status}`)
        return null
    }

    subject = template.subject

    const { data: emailData, error } = await resend.emails.send({
      from: `${EMAIL_CONFIG.fromName} <${EMAIL_CONFIG.from}>`,
      to: data.customerEmail,
      subject,
      html: template.html,
      replyTo: EMAIL_CONFIG.replyTo
    })

    if (error) {
      console.error('Error sending order status email:', error)
      throw new Error(`Failed to send status email: ${error.message}`)
    }

    console.log(`Order status email sent for ${data.status}:`, emailData?.id)
    return emailData
  } catch (error) {
    console.error('Error in sendOrderStatusEmail:', error)
    throw error
  }
}

/**
 * Send email via API route (for webhook usage)
 */
export async function sendEmailViaAPI(emailData: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const response = await fetch('/api/send-order-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Secret': process.env.EMAIL_WEBHOOK_SECRET || ''
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to send email via API')
    }

    return await response.json()
  } catch (error) {
    console.error('Error sending email via API:', error)
    throw error
  }
}

/**
 * Test email functionality
 */
export async function testEmailService() {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }

    const testData: OrderEmailData = {
      orderId: 'TEST-123',
      customerName: 'Test User',
      customerEmail: 'test@example.com',
      totalAmount: 99.99,
      status: 'confirmed',
      items: [
        { title: 'Test Product', quantity: 1, price: 99.99 }
      ]
    }

    const result = await sendOrderConfirmationEmail(testData)
    console.log('Email test successful:', result)
    return result
  } catch (error) {
    console.error('Email test failed:', error)
    throw error
  }
}