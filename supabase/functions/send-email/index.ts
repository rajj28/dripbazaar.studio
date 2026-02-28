import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'order_confirmation' | 'payment_received' | 'payment_verified'
  orderId: string
  userEmail: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, orderId, userEmail }: EmailRequest = await req.json()

    // Get order and payment details
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    const { data: order } = await supabase
      .from('orders')
      .select('*, payments(*)')
      .eq('id', orderId)
      .single()

    if (!order) {
      throw new Error('Order not found')
    }

    let subject = ''
    let html = ''

    switch (type) {
      case 'order_confirmation':
        subject = `Order Confirmed - ${order.drop_name} Pre-Booking`
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #F97316, #ea580c); color: white; padding: 30px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; }
                .order-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #F97316; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                .button { display: inline-block; background: #F97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 Order Confirmed!</h1>
                  <p>Thank you for pre-booking with DRIP BAZAAR</p>
                </div>
                <div class="content">
                  <p>Hi ${order.full_name},</p>
                  <p>Your pre-booking has been successfully confirmed! We're excited to have you as part of the DRIP BAZAAR community.</p>
                  
                  <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Product:</strong> ${order.drop_name}</p>
                    <p><strong>Size:</strong> ${order.size}</p>
                    <p><strong>Amount:</strong> ₹${order.price}</p>
                    <p><strong>Delivery Address:</strong><br>
                    ${order.address}<br>
                    ${order.city}, ${order.state} - ${order.pincode}</p>
                  </div>

                  <p><strong>Next Steps:</strong></p>
                  <ol>
                    <li>Complete your payment using the QR code provided</li>
                    <li>Upload payment screenshot and transaction ID</li>
                    <li>We'll verify your payment within 24 hours</li>
                    <li>Your order will be shipped within 15-20 days</li>
                  </ol>

                  <p>If you haven't completed payment yet, please do so to confirm your order.</p>
                </div>
                <div class="footer">
                  <p>DRIP BAZAAR - India's First Verified Thrift Marketplace</p>
                  <p>Build from Chaos</p>
                </div>
              </div>
            </body>
          </html>
        `
        break

      case 'payment_received':
        subject = `Payment Received - ${order.drop_name} Order`
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #F97316, #ea580c); color: white; padding: 30px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; }
                .payment-details { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4ade80; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>💰 Payment Received!</h1>
                  <p>We're processing your payment</p>
                </div>
                <div class="content">
                  <p>Hi ${order.full_name},</p>
                  <p>We have received your payment details for ${order.drop_name}. Our team is currently verifying your payment.</p>
                  
                  <div class="payment-details">
                    <h3>Payment Information</h3>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Transaction ID:</strong> ${order.payments?.[0]?.transaction_id || 'N/A'}</p>
                    <p><strong>Amount:</strong> ₹${order.price}</p>
                    <p><strong>Status:</strong> Pending Verification</p>
                  </div>

                  <p><strong>What happens next?</strong></p>
                  <ul>
                    <li>Our team will verify your payment within 24 hours</li>
                    <li>You'll receive a confirmation email once verified</li>
                    <li>Your order will be prepared for shipping</li>
                    <li>Estimated delivery: 15-20 days from verification</li>
                  </ul>

                  <p>Thank you for your patience!</p>
                </div>
                <div class="footer">
                  <p>DRIP BAZAAR - India's First Verified Thrift Marketplace</p>
                  <p>Build from Chaos</p>
                </div>
              </div>
            </body>
          </html>
        `
        break

      case 'payment_verified':
        subject = `✅ Order Confirmed - ${order.drop_name}`
        html = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #4ade80, #22c55e); color: white; padding: 30px; text-align: center; }
                .content { background: #f9f9f9; padding: 30px; }
                .success-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4ade80; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>✅ Order Confirmed!</h1>
                  <p>Your payment has been verified</p>
                </div>
                <div class="content">
                  <p>Hi ${order.full_name},</p>
                  <p>Great news! Your payment has been verified and your order is now confirmed. We're preparing your ${order.drop_name} for shipment!</p>
                  
                  <div class="success-box">
                    <h3>✓ Order Confirmed</h3>
                    <p><strong>Order ID:</strong> ${order.id}</p>
                    <p><strong>Product:</strong> ${order.drop_name}</p>
                    <p><strong>Size:</strong> ${order.size}</p>
                    <p><strong>Amount Paid:</strong> ₹${order.price}</p>
                    <p><strong>Status:</strong> Confirmed & Ready to Ship ✓</p>
                  </div>

                  <p><strong>Shipping Information:</strong></p>
                  <p>Your order will be shipped to:</p>
                  <p style="padding-left: 20px;">
                    ${order.full_name}<br>
                    ${order.address}<br>
                    ${order.city}, ${order.state} - ${order.pincode}<br>
                    Phone: ${order.phone}
                  </p>

                  <p><strong>Estimated Delivery:</strong> 15-20 days from today</p>
                  <p>You'll receive a tracking number once your order ships.</p>

                  <p>Thank you for choosing DRIP BAZAAR! 🔥</p>
                </div>
                <div class="footer">
                  <p>DRIP BAZAAR - India's First Verified Thrift Marketplace</p>
                  <p>Build from Chaos</p>
                </div>
              </div>
            </body>
          </html>
        `
        break
    }

    // Send email via Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'DRIP BAZAAR <orders@dripbazaar.com>',
        to: [userEmail],
        subject: subject,
        html: html,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Failed to send email')
    }

    return new Response(
      JSON.stringify({ success: true, emailId: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
