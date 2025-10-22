'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleSignIn = () => {
    router.push('/login')
  }

  if (loading) {
    return (
      <Button variant="outline" disabled className="hidden sm:inline-flex">
        Loading...
      </Button>
    )
  }

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="text-sm text-gray-700">
            {user.user_metadata?.full_name || user.email}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      className="hidden sm:inline-flex"
    >
      Sign In
    </Button>
  )
}