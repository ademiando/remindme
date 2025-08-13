export interface ScheduledPrompt {
  id: string
  user_id: string
  prompt: string
  model: string
  schedule_time: string
  channel: 'email' | 'telegram'
  created_at: string
}
