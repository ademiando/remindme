import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <a href="/" className="font-bold">RemindMe</a>
      <div className="flex gap-2">
        <a href="/chat" className="underline">Chat</a>
        <a href="/scheduled" className="underline">Scheduled</a>
        <a href="/subscription" className="underline">Subscription</a>
        <button onClick={handleLogout} className="bg-red-600 px-3 rounded">Logout</button>
      </div>
    </nav>
  )
}
