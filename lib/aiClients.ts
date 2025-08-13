import OpenAI from 'openai'

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export type SupportedModel = 'gpt-3.5-turbo' | 'gpt-4o-mini' | 'gpt-4o'

export async function getAiResponse(model: string, prompt: string): Promise<string> {
  // Map friendly names to actual model IDs if needed
  const modelMap: Record<string, string> = {
    'gpt-3.5': 'gpt-3.5-turbo',
    'gpt-4': 'gpt-4o',
    'gpt-4-mini': 'gpt-4o-mini',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini'
  }
  const resolved = modelMap[model] ?? model

  const completion = await openAiClient.chat.completions.create({
    model: resolved,
    messages: [{ role: 'user', content: prompt }]
  })
  return completion.choices?.[0]?.message?.content ?? ''
}
