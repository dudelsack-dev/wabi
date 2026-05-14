export type IntentType = 'WANT' | 'HAVE' | 'REVOKED'

export interface Intent {
  id: string
  userId: string
  type: IntentType
  category: string
  item: string
  brand?: string
  confidence: number
  active: boolean
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
  expiresAt?: string
}

export interface ParsedIntent {
  type: IntentType
  category: string
  item: string
  brand?: string
  confidence: number
}

export interface SyncResult {
  platform: string
  status: 'success' | 'failure' | 'pending' | 'stub'
  message?: string
  response?: unknown
}

export interface AdProfile {
  userId: string
  wants: Intent[]
  has: Intent[]
  revoked: Intent[]
  platforms: PlatformConfig[]
}

export interface PlatformConfig {
  userId: string
  platform: string
  enabled: boolean
  lastSyncedAt?: string
}

export type Platform = 'google-ads' | 'instagram' | 'tiktok' | 'facebook' | 'spotify'

export const PLATFORMS: Platform[] = ['google-ads', 'instagram', 'tiktok', 'facebook', 'spotify']
