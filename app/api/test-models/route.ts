import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const models = [
    'claude-3-opus-20250219',
    'claude-3-opus',
    'claude-3.5-opus',
    'claude-opus',
    'claude',
  ]

  const results: Record<string, string> = {}

  for (const model of models) {
    try {
      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      })

      const msg = await client.messages.create({
        model: model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      })

      results[model] = '✅ WORKS'
      break  // Stop at first working model
    } catch (error: any) {
      results[model] = error.message.split('\n')[0].substring(0, 50)
    }
  }

  return NextResponse.json(results)
}
