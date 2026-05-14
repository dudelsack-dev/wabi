import type { Intent, SyncResult } from '../types/index.js'

export interface AdPlatform {
  readonly name: string
  sync(userId: string, intents: Intent[]): Promise<SyncResult>
  isConfigured(userId: string): Promise<boolean>
}
