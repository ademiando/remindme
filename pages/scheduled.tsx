import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Layout/Navbar'
import Sidebar from '../components/Layout/Sidebar'
import ScheduleForm from '../components/Scheduled/ScheduleForm'
import ScheduledList from '../components/Scheduled/ScheduledList'

export default function ScheduledPage() {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if(!data.session) window.location.href='/login'
      else setUserId(data.session.user.id)
    })
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 flex flex-col gap-4">
          {userId && <ScheduleForm userId={userId} onAdded={()=>{}} />}
          {userId && <ScheduledList userId={userId} />}
        </main>
      </div>
    </div>
  )
}
