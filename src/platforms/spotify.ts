import type { AdPlatform } from './base.js'
import type { Intent, SyncResult } from '../types/index.js'

export class Spotify implements AdPlatform {
  readonly name = 'spotify'

  async sync(_userId: string, _intents: Intent[]): Promise<SyncResult> {
    return { platform: this.name, status: 'stub', message: 'Spotify integration not yet implemented' }
  }

  async isConfigured(_userId: string): Promise<boolean> {
    return false
  }
}
