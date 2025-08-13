import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { ChatMessage as ChatMessageType } from '../../types/chat'
import ChatMessage from './ChatMessage'

type Props = { userId: string }

export default function ChatWindow({ userId }: Props) {
  const [messages, setMessages] = useState<ChatMessageType[]>([])

  const fetchMessages = async () => {
    const { data } = await supabase.from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    if(data) setMessages(data)
  }

  useEffect(() => {
    if(!userId) return
    fetchMessages()
    const channel = supabase
      .channel('chat_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_history', filter: `user_id=eq.${userId}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new as any])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return (
    <div className="flex flex-col h-[420px] overflow-y-auto p-2 border rounded gap-1 bg-white">
      {messages.map(msg => <ChatMessage key={msg.id} message={msg} userId={userId} />)}
    </div>
  )
}
