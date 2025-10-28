import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, planId } = await request.json()

    if (!sessionId || !planId) {
      return NextResponse.json(
        { error: 'Session ID and Plan ID are required' },
        { status: 400 }
      )
    }

    // Verify payment with Creem
    const session = await paymentService.verifyPayment(sessionId)

    if (session.status !== 'completed') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Get user from Supabase auth
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Update user subscription in database
    // You might want to create a subscriptions table in Supabase
    const plan = paymentService.getPlanById(planId)

    if (plan) {
      // Store subscription data in Supabase
      const { error: insertError } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_id: planId,
          plan_name: plan.name,
          status: 'active',
          payment_session_id: sessionId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error storing subscription:', insertError)
        // Payment succeeded but DB update failed - you might want to handle this differently
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      plan: plan
    })

  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}