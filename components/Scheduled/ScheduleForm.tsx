import { useState } from 'react'
import ModelSelector from '../Shared/ModelSelector'

type Props = { userId: string, onAdded: () => void }

export default function ScheduleForm({ userId, onAdded }: Props) {
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('gpt-3.5')
  const [time, setTime] = useState('')
  const [channel, setChannel] = useState<'email'|'telegram'>('email')
  const [preview, setPreview] = useState<string>('')

  const handlePreview = async () => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model, user_id: userId, preview: true })
    })
    const data = await res.json()
    setPreview(data.reply ?? '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, prompt, model, schedule_time: new Date(time).toISOString(), channel })
    })
    onAdded()
    setPrompt('')
    setTime('')
    setPreview('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-2 border rounded bg-white">
      <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Enter scheduled prompt" className="border p-2 rounded"/>
      <div className="flex items-center gap-2">
        <ModelSelector model={model} setModel={setModel} />
        <input type="datetime-local" value={time} onChange={e=>setTime(e.target.value)} className="border p-2 rounded"/>
        <select value={channel} onChange={e=>setChannel(e.target.value as any)} className="border p-2 rounded">
          <option value="email">Email</option>
          <option value="telegram">Telegram</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handlePreview} className="bg-gray-200 px-3 py-2 rounded">Preview</button>
        <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded">Save Schedule</button>
      </div>
      {preview && <div className="border rounded p-2 bg-gray-50"><strong>Preview:</strong><div className="whitespace-pre-wrap">{preview}</div></div>}
    </form>
  )
}
