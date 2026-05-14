import type { AdPlatform } from './base.js'
import type { Intent, SyncResult } from '../types/index.js'

export class Instagram implements AdPlatform {
  readonly name = 'instagram'

  async sync(_userId: string, _intents: Intent[]): Promise<SyncResult> {
    return { platform: this.name, status: 'stub', message: 'Instagram integration not yet implemented' }
  }

  async isConfigured(_userId: string): Promise<boolean> {
    return false
  }
}
