'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started with AI image editing',
    features: [
      '5 AI edits per month',
      'Basic filters and adjustments',
      'Standard resolution exports',
      'Community support'
    ],
    popular: false,
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: '/month',
    description: 'Everything you need for professional image editing',
    features: [
      'Unlimited AI edits',
      'Advanced AI filters and effects',
      'High-resolution exports',
      'Priority support',
      'Batch processing',
      'Custom presets'
    ],
    popular: true,
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$49.99',
    period: '/month',
    description: 'For teams and businesses with advanced needs',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Advanced analytics',
      'Custom branding'
    ],
    popular: false,
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const
  }
]

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') {
      // Handle free plan activation
      window.location.href = '/login'
      return
    }

    if (planId === 'enterprise') {
      // Handle enterprise contact
      window.location.href = 'mailto:sales@nanobanana.ai'
      return
    }

    setLoadingPlan(planId)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (response.ok && data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('There was an error processing your request. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🍌</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your AI image editing needs. Start for free and upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${
                plan.popular
                  ? 'border-orange-500 shadow-lg scale-105'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 bg-orange-500 text-white">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-1">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="mt-2 text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                <Button
                  className={`w-full mb-6 ${
                    plan.popular
                      ? 'bg-orange-600 hover:bg-orange-700'
                      : ''
                  }`}
                  variant={plan.buttonVariant}
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <Check className="w-5 h-5 text-orange-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and various other payment methods through our secure payment processor.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Pro plan comes with a 14-day free trial. No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens to my images if I cancel?
              </h3>
              <p className="text-gray-600">
                You keep all your edited images forever. We'll also keep your account data for 30 days in case you want to reactivate.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-orange-500 to-yellow-500 border-0 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Images?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of creators using Nano Banana to enhance their images with AI.
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 font-semibold"
                onClick={() => handlePlanSelect('pro')}
                disabled={loadingPlan === 'pro'}
              >
                {loadingPlan === 'pro' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Start Your Free Trial'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}