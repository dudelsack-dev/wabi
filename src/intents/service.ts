import { extractIntents } from '../nlp/pipeline.js'
import { createIntent, revokeIntent, listIntents, listPlatformConfigs } from '../db/queries.js'
import type { Intent, AdProfile } from '../types/index.js'

export async function recordIntents(userId: string, text: string): Promise<Intent[]> {
  const parsed = await extractIntents(text)
  if (parsed.length === 0) return []

  const created = await Promise.all(parsed.map((p) => createIntent(userId, p)))
  return created
}

export async function revokeIntentByIdOrItem(
  userId: string,
  intentId?: string,
  item?: string
): Promise<Intent[]> {
  return revokeIntent(userId, intentId, item)
}

export async function getUserIntents(
  userId: string,
  type?: Intent['type'],
  activeOnly = true
): Promise<Intent[]> {
  return listIntents(userId, type, activeOnly)
}

export async function getAdProfile(userId: string): Promise<AdProfile> {
  const [wants, has, revoked, platforms] = await Promise.all([
    listIntents(userId, 'WANT'),
    listIntents(userId, 'HAVE'),
    listIntents(userId, 'REVOKED'),
    listPlatformConfigs(userId),
  ])

  return { userId, wants, has, revoked, platforms }
}
