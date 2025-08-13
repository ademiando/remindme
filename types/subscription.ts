export interface Subscription {
  id: string
  user_id: string
  plan: 'free' | 'pro'
  maxScheduled: number
  created_at: string
}
