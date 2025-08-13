import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Layout/Navbar'
import Sidebar from '../components/Layout/Sidebar'
import ChatWindow from '../components/Chat/ChatWindow'
import ChatInput from '../components/Chat/ChatInput'
import ModelSelector from '../components/Shared/ModelSelector'

export default function ChatPage() {
  const [userId, setUserId] = useState('')
  const [model, setModel] = useState('gpt-3.5')

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
        <main className="flex-1 p-4 flex flex-col">
          <div className="mb-2"><ModelSelector model={model} setModel={setModel} /></div>
          {userId && <ChatWindow userId={userId} />}
          {userId && <ChatInput userId={userId} model={model} />}
        </main>
      </div>
    </div>
  )
}
