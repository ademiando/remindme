import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { ScheduledPrompt } from '../../types/schedule'
import { formatDate } from '../../utils/formatDate'

type Props = { userId: string }

export default function ScheduledList({ userId }: Props) {
  const [schedules, setSchedules] = useState<ScheduledPrompt[]>([])

  const fetchSchedules = async () => {
    const { data } = await supabase.from('scheduled_prompts').select('*').eq('user_id', userId).order('schedule_time', { ascending: true })
    if(data) setSchedules(data)
  }

  const handleDelete = async (id: string) => {
    await supabase.from('scheduled_prompts').delete().eq('id', id)
    fetchSchedules()
  }

  useEffect(()=>{ if(userId) fetchSchedules() }, [userId])

  return (
    <div className="p-2 border rounded flex flex-col gap-2 bg-white">
      {schedules.map(s => (
        <div key={s.id} className="flex justify-between border p-2 rounded">
          <div className="pr-2">
            <p className="font-medium">{s.prompt}</p>
            <small className="text-gray-600">{s.model} | {s.channel} | {formatDate(s.schedule_time)}</small>
          </div>
          <button onClick={()=>handleDelete(s.id)} className="bg-red-600 text-white px-2 rounded">Delete</button>
        </div>
      ))}
      {schedules.length === 0 && <div className="text-center text-gray-500">No schedules yet.</div>}
    </div>
  )
}
