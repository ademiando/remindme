import { useState } from 'react'

type Props = { userId: string, model: string }

export default function ChatInput({ userId, model }: Props) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if(!prompt) return
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, user_id: userId })
      })
      if(!res.ok) throw new Error('Request failed')
      setPrompt('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="flex gap-2 mt-2">
      <input
        type="text"
        value={prompt}
        onChange={e=>setPrompt(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border rounded p-2 bg-white"
      />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 rounded">
        {loading ? '...' : 'Send'}
      </button>
    </form>
  )
}
