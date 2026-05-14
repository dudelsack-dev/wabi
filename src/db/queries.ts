import { db } from './client.js'
import type { Intent, ParsedIntent, PlatformConfig } from '../types/index.js'

type IntentRow = {
  id: string
  user_id: string
  type: string
  category: string
  item: string
  brand: string | null
  confidence: number
  active: boolean
  metadata: Record<string, unknown> | null
  created_at: string
  updated_at: string
  expires_at: string | null
}

function rowToIntent(row: IntentRow): Intent {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as Intent['type'],
    category: row.category,
    item: row.item,
    brand: row.brand ?? undefined,
    confidence: row.confidence,
    active: row.active,
    metadata: row.metadata ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    expiresAt: row.expires_at ?? undefined,
  }
}

export async function createIntent(
  userId: string,
  parsed: ParsedIntent
): Promise<Intent> {
  const { data, error } = await db
    .from('footprint_intents')
    .insert({
      user_id: userId,
      type: parsed.type,
      category: parsed.category,
      item: parsed.item,
      brand: parsed.brand ?? null,
      confidence: parsed.confidence,
    })
    .select()
    .single()

  if (error) throw new Error(`createIntent: ${error.message}`)
  return rowToIntent(data as IntentRow)
}

export async function revokeIntent(
  userId: string,
  intentId?: string,
  item?: string
): Promise<Intent[]> {
  let query = db
    .from('footprint_intents')
    .update({ active: false })
    .eq('user_id', userId)
    .eq('active', true)

  if (intentId) {
    query = query.eq('id', intentId)
  } else if (item) {
    query = query.ilike('item', `%${item}%`)
  } else {
    throw new Error('revokeIntent: provide intentId or item')
  }

  const { data, error } = await query.select()
  if (error) throw new Error(`revokeIntent: ${error.message}`)
  return (data as IntentRow[]).map(rowToIntent)
}

export async function listIntents(
  userId: string,
  type?: Intent['type'],
  activeOnly = true
): Promise<Intent[]> {
  let query = db
    .from('footprint_intents')
    .select()
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (activeOnly) query = query.eq('active', true)
  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw new Error(`listIntents: ${error.message}`)
  return (data as IntentRow[]).map(rowToIntent)
}

export async function upsertPlatformConfig(
  userId: string,
  platform: string,
  enabled: boolean
): Promise<PlatformConfig> {
  const { data, error } = await db
    .from('footprint_platform_configs')
    .upsert({ user_id: userId, platform, enabled }, { onConflict: 'user_id,platform' })
    .select()
    .single()

  if (error) throw new Error(`upsertPlatformConfig: ${error.message}`)
  const row = data as { user_id: string; platform: string; enabled: boolean; last_synced_at: string | null }
  return {
    userId: row.user_id,
    platform: row.platform,
    enabled: row.enabled,
    lastSyncedAt: row.last_synced_at ?? undefined,
  }
}

export async function listPlatformConfigs(userId: string): Promise<PlatformConfig[]> {
  const { data, error } = await db
    .from('footprint_platform_configs')
    .select()
    .eq('user_id', userId)

  if (error) throw new Error(`listPlatformConfigs: ${error.message}`)
  return (
    data as { user_id: string; platform: string; enabled: boolean; last_synced_at: string | null }[]
  ).map((row) => ({
    userId: row.user_id,
    platform: row.platform,
    enabled: row.enabled,
    lastSyncedAt: row.last_synced_at ?? undefined,
  }))
}

export async function recordSyncLog(
  intentId: string,
  platform: string,
  status: 'success' | 'failure' | 'pending',
  response?: unknown
): Promise<void> {
  const { error } = await db.from('footprint_sync_logs').insert({
    intent_id: intentId,
    platform,
    status,
    response: response ?? null,
  })
  if (error) throw new Error(`recordSyncLog: ${error.message}`)
}
