import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { user_id, prompt, model = 'gpt-3.5', schedule_time, channel } = req.body
    if (!user_id || !prompt || !schedule_time || !channel) return res.status(400).json({ error: 'Missing fields' })

    // enforce subscription limit
    const { data: sub } = await supabase.from('subscriptions').select('*').eq('user_id', user_id).single()
    const maxAllowed = sub?.max_scheduled ?? 2
    const { count } = await supabase.from('scheduled_prompts').select('*', { count: 'exact', head: true }).eq('user_id', user_id)

    if ((count ?? 0) >= maxAllowed) {
      return res.status(403).json({ error: `Limit reached. Your plan allows ${maxAllowed} schedules.` })
    }

    const { data, error } = await supabase
      .from('scheduled_prompts')
      .insert([{ user_id, prompt, model, schedule_time, channel }])
      .select()

    if (error) return res.status(500).json({ error })
    return res.status(200).json({ success: true, scheduled: data })
  }

  if (req.method === 'GET') {
    const { user_id } = req.query as { user_id: string }
    const { data, error } = await supabase.from('scheduled_prompts').select('*').eq('user_id', user_id)
    if (error) return res.status(500).json({ error })
    return res.status(200).json({ data })
  }

  return res.status(405).end()
}
