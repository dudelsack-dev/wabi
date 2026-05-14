import Anthropic from '@anthropic-ai/sdk'
import { INTENT_EXTRACTION_SYSTEM_PROMPT, buildUserPrompt } from './prompts.js'
import type { ParsedIntent } from '../types/index.js'

const client = new Anthropic()

export async function extractIntents(text: string): Promise<ParsedIntent[]> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: INTENT_EXTRACTION_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(text),
      },
    ],
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('extractIntents: unexpected response type from Claude')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(content.text)
  } catch {
    throw new Error(`extractIntents: Claude returned non-JSON: ${content.text}`)
  }

  if (!Array.isArray(parsed)) {
    throw new Error('extractIntents: Claude did not return an array')
  }

  return parsed as ParsedIntent[]
}
