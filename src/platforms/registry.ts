import type { AdPlatform } from './base.js'
import { GoogleAds } from './google-ads.js'
import { Instagram } from './instagram.js'
import { TikTok } from './tiktok.js'
import { Facebook } from './facebook.js'
import { Spotify } from './spotify.js'

const platforms = new Map<string, AdPlatform>([
  ['google-ads', new GoogleAds()],
  ['instagram', new Instagram()],
  ['tiktok', new TikTok()],
  ['facebook', new Facebook()],
  ['spotify', new Spotify()],
])

export function getPlatform(name: string): AdPlatform | undefined {
  return platforms.get(name)
}

export function listPlatformNames(): string[] {
  return Array.from(platforms.keys())
}

export { platforms }
