import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function SubscriptionPage() {
  const [plan, setPlan] = useState('free')
  const [userId, setUserId] = useState('')

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session) window.location.href='/login'
      else setUserId(data.session.user.id)
    })
    ;(async () => {
      const { data } = await supabase.from('subscriptions').select('*').single()
      if(data?.plan) setPlan(data.plan)
    })()
  }, [])

  const handleUpgrade = async () => {
    await supabase.from('subscriptions').upsert({ user_id: userId, plan: 'pro', max_scheduled: 10 })
    setPlan('pro')
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Subscription Plan</h2>
      <p>Current plan: <strong>{plan}</strong></p>
      {plan==='free' && <button onClick={handleUpgrade} className="mt-2 bg-blue-600 text-white p-2 rounded">Upgrade to Pro</button>}
    </div>
  )
}
