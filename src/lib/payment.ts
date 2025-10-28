import { Creem } from 'creem'

export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
}

export const PRICING_PLANS: PaymentPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'month',
    features: [
      '5 AI edits per month',
      'Basic filters and adjustments',
      'Standard resolution exports',
      'Community support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 999, // $9.99 in cents
    currency: 'USD',
    interval: 'month',
    features: [
      'Unlimited AI edits',
      'Advanced AI filters and effects',
      'High-resolution exports',
      'Priority support',
      'Batch processing',
      'Custom presets'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999, // $49.99 in cents
    currency: 'USD',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'Custom branding'
    ]
  }
]

class PaymentService {
  private creem: Creem

  constructor() {
    if (!process.env.NEXT_PUBLIC_CREEM_PUBLIC_KEY) {
      throw new Error('Creem public key not found. Please set NEXT_PUBLIC_CREEM_PUBLIC_KEY environment variable.')
    }

    this.creem = new Creem()
  }

  async createCheckoutSession(planId: string, userEmail?: string) {
    const plan = PRICING_PLANS.find(p => p.id === planId)
    if (!plan) {
      throw new Error(`Plan with id ${planId} not found`)
    }

    if (plan.price === 0) {
      // Handle free plan - no payment needed
      return { success: true, message: 'Free plan activated' }
    }

    try {
      const result = await this.creem.createCheckout({
        xApiKey: process.env.NEXT_PUBLIC_CREEM_PUBLIC_KEY!,
        createCheckoutRequest: {
          productId: planId, // You'll need to create products in Creem first
          units: 1,
          customer: userEmail ? {
            email: userEmail,
          } : undefined,
          metadata: {
            plan_id: planId,
            plan_name: plan.name,
            interval: plan.interval
          }
        }
      })

      return result

    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw new Error('Failed to create checkout session')
    }
  }

  async verifyPayment(sessionId: string) {
    try {
      const session = await this.creem.retrieveCheckout({
        checkoutId: sessionId,
        xApiKey: process.env.NEXT_PUBLIC_CREEM_PUBLIC_KEY!
      })
      return session
    } catch (error) {
      console.error('Error verifying payment:', error)
      throw new Error('Failed to verify payment')
    }
  }

  getPlanById(planId: string): PaymentPlan | undefined {
    return PRICING_PLANS.find(plan => plan.id === planId)
  }
}

export const paymentService = new PaymentService()
export default PaymentService