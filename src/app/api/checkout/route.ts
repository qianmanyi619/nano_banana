import { NextRequest, NextResponse } from 'next/server'
import { paymentService } from '@/lib/payment'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
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

    // Create checkout session
    const session = await paymentService.createCheckoutSession(
      planId,
      user.email
    )

    return NextResponse.json(session)

  } catch (error) {
    console.error('Error in checkout API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}