import type { AdPlatform } from './base.js'
import type { Intent, SyncResult } from '../types/index.js'

export class GoogleAds implements AdPlatform {
  readonly name = 'google-ads'

  async sync(_userId: string, _intents: Intent[]): Promise<SyncResult> {
    return { platform: this.name, status: 'stub', message: 'Google Ads integration not yet implemented' }
  }

  async isConfigured(_userId: string): Promise<boolean> {
    return false
  }
}
