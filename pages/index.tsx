import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if(data.session) router.push('/chat')
      else router.push('/login')
    })
  }, [router])

  return <p className="p-6">Loading...</p>
}
