/**
 * API route for sending order emails
 * Used by PostgreSQL triggers to send automated notifications
 */

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Validate webhook secret
 */
function validateWebhookSecret(request: NextRequest): boolean {
  const headersList = headers()
  const providedSecret = headersList.get('x-secret')
  const expectedSecret = process.env.EMAIL_WEBHOOK_SECRET
  
  if (!expectedSecret || !providedSecret) {
    return false
  }
  
  return providedSecret === expectedSecret
}

/**
 * POST /api/send-order-email
 * Sends an email using Resend API
 * Expected body: { to, subject, html, from? }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate webhook secret for security
    if (!validateWebhookSecret(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { to, subject, html, from } = body

    // Validate required fields
    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: from || `${process.env.FROM_NAME || 'Your Store'} <${process.env.FROM_EMAIL || 'noreply@yourstore.com'}>`,
      to,
      subject,
      html,
      replyTo: process.env.REPLY_TO_EMAIL || 'support@yourstore.com'
    })

    if (error) {
      console.error('Resend API error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data?.id)
    
    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'Email sent successfully'
    })

  } catch (error) {
    console.error('Send email API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/send-order-email
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'email',
    timestamp: new Date().toISOString()
  })
}