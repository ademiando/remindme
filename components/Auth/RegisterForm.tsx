import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if(error) return setError(error.message)
    router.push('/chat')
  }

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input type="email" placeholder="Email" className="w-full p-2 mb-3 border rounded"
        value={email} onChange={e=>setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" className="w-full p-2 mb-3 border rounded"
        value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit" className="w-full p-2 bg-green-600 text-white rounded" disabled={loading}>
        {loading ? 'Loading...' : 'Register'}
      </button>
      <p className="text-sm mt-2">Sudah punya akun? <a className="text-blue-600" href="/login">Login</a></p>
    </form>
  )
}
