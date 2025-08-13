import type { NextApiRequest, NextApiResponse } from 'next'
import { getAiResponse } from '../../lib/aiClients'
import { supabase } from '../../lib/supabaseClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { prompt, model = 'gpt-3.5', user_id, preview } = req.body
  if (!prompt || !user_id) return res.status(400).json({ error: 'Missing prompt or user_id' })

  try {
    const aiReply = await getAiResponse(model, prompt)

    if (!preview) {
      await supabase.from('chat_history').insert([{ user_id, content: aiReply, model }])
    }

    return res.status(200).json({ reply: aiReply })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'AI request failed' })
  }
}
