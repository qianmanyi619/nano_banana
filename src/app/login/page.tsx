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

  const signInWithGoogle = async () => {
    'use server'

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })

    if (data.url) {
      redirect(data.url)
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

        <div className="space-y-4">
          <form action={signInWithGoogle}>
            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continue with Google</span>
            </Button>
          </form>

          <form action={signInWithGitHub}>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </Button>
          </form>
        </div>

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