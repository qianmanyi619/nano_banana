import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github } from 'lucide-react'

export default async function Login() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  const signInWithGitHub = async () => {
    'use server'

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (data.url) {
      redirect(data.url) // use the redirect API for your server framework
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-orange-50">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🍌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Nano Banana</h1>
          <p className="text-gray-600">Sign in to start editing your images with AI</p>
        </div>

        <form action={signInWithGitHub} className="space-y-4">
          <Button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
          >
            <Github className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <a href="#" className="text-orange-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-orange-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}