import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paymentService } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const webhook = await request.json()

    // Verify webhook signature (you should implement this for security)
    // const signature = request.headers.get('creem-signature')
    // if (!verifyWebhookSignature(webhook, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    // }

    const { event_type, data } = webhook

    switch (event_type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(data)
        break
      case 'checkout.session.failed':
        await handleCheckoutFailed(data)
        break
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data)
        break
      default:
        console.log(`Unhandled event type: ${event_type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(data: any) {
  const supabase = await createClient()

  const planId = data.metadata?.plan_id
  const customerEmail = data.customer_email
  const sessionId = data.id

  if (!planId || !customerEmail) {
    console.error('Missing plan_id or customer_email in webhook data')
    return
  }

  // Find user by email
  const { data: users, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', customerEmail)
    .single()

  if (error || !users) {
    console.error('User not found for email:', customerEmail)
    return
  }

  const plan = paymentService.getPlanById(planId)
  if (!plan) {
    console.error('Plan not found:', planId)
    return
  }

  // Update or insert subscription
  const { error: upsertError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: users.id,
      plan_id: planId,
      plan_name: plan.name,
      status: 'active',
      payment_session_id: sessionId,
      updated_at: new Date().toISOString()
    })

  if (upsertError) {
    console.error('Error updating subscription:', upsertError)
  }
}

async function handleCheckoutFailed(data: any) {
  // Handle failed payments
  console.log('Checkout failed:', data)
}

async function handleSubscriptionCancelled(data: any) {
  const supabase = await createClient()

  const sessionId = data.payment_session_id

  if (!sessionId) {
    console.error('Missing payment_session_id in webhook data')
    return
  }

  // Update subscription status to cancelled
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'cancelled',
      updated_at: new Date().toISOString()
    })
    .eq('payment_session_id', sessionId)

  if (error) {
    console.error('Error cancelling subscription:', error)
  }
}