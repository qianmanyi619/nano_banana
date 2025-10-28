'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [planName, setPlanName] = useState<string>('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    const planId = searchParams.get('plan')

    if (!sessionId || !planId) {
      setVerificationStatus('error')
      return
    }

    // Verify payment
    fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, planId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setVerificationStatus('success')
          setPlanName(data.plan?.name || 'Unknown Plan')
        } else {
          setVerificationStatus('error')
        }
      })
      .catch(error => {
        console.error('Payment verification error:', error)
        setVerificationStatus('error')
      })
  }, [searchParams])

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg text-center">
        <CardHeader>
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍌</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {verificationStatus === 'loading' && 'Verifying Payment...'}
            {verificationStatus === 'success' && 'Payment Successful!'}
            {verificationStatus === 'error' && 'Payment Failed'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {verificationStatus === 'loading' && (
              <Loader2 className="w-16 h-16 text-orange-500 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-500" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>

          <div>
            {verificationStatus === 'loading' && (
              <p className="text-gray-600">
                Please wait while we verify your payment...
              </p>
            )}
            {verificationStatus === 'success' && (
              <div>
                <p className="text-gray-600 mb-2">
                  Congratulations! Your {planName} subscription is now active.
                </p>
                <p className="text-gray-600">
                  You can now enjoy all the features included in your plan.
                </p>
              </div>
            )}
            {verificationStatus === 'error' && (
              <div>
                <p className="text-gray-600 mb-2">
                  There was an issue verifying your payment.
                </p>
                <p className="text-gray-600">
                  Please contact support if you believe this is an error.
                </p>
              </div>
            )}
          </div>

          {verificationStatus !== 'loading' && (
            <div className="space-y-3">
              <Button
                onClick={handleContinue}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {verificationStatus === 'success' ? 'Continue to App' : 'Go to Pricing'}
              </Button>

              {verificationStatus === 'error' && (
                <Button
                  variant="outline"
                  onClick={() => router.push('/pricing')}
                  className="w-full"
                >
                  Try Again
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}