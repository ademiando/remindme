import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../lib/supabaseClient'
import { getAiResponse } from '../../lib/aiClients'
import { sendEmailNotification } from '../../utils/sendNotification'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { data: schedules, error } = await supabase
      .from('scheduled_prompts')
      .select('*')
    if (error) return res.status(500).json({ error })

    const now = new Date()

    for (const s of schedules ?? []) {
      const scheduleTime = new Date(s.schedule_time)
      if (Math.abs(now.getTime() - scheduleTime.getTime()) <= 60000) { // within ±1min
        const aiReply = await getAiResponse(s.model, s.prompt)

        if (s.channel === 'email') {
          // Fetch user email from auth schema via supabase-js auth admin is not available client-side here.
          // Expect a 'users' public table mapping user_id -> email (optional). Fallback: store email in subscriptions later.
          // For simplicity, ask user to put their own email equals auth email in 'auth.users' — we cannot read it directly here.
          // So we rely on a 'profiles' table (optional). If missing, skip.
          const { data: prof } = await supabase.from('profiles').select('email').eq('id', s.user_id).single()
          const toEmail = prof?.email
          if (toEmail) {
            await sendEmailNotification(toEmail, 'Scheduled AI Reply', aiReply)
          }
        }
      }
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'run failed' })
  }
}
