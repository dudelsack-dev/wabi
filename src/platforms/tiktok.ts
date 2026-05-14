import type { AdPlatform } from './base.js'
import type { Intent, SyncResult } from '../types/index.js'

export class TikTok implements AdPlatform {
  readonly name = 'tiktok'

  async sync(_userId: string, _intents: Intent[]): Promise<SyncResult> {
    return { platform: this.name, status: 'stub', message: 'TikTok integration not yet implemented' }
  }

  async isConfigured(_userId: string): Promise<boolean> {
    return false
  }
}
