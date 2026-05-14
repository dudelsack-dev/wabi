import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import { recordIntents, revokeIntentByIdOrItem, getUserIntents, getAdProfile } from '../intents/service.js'
import { getPlatform, listPlatformNames } from '../platforms/registry.js'
import { upsertPlatformConfig, listIntents, recordSyncLog } from '../db/queries.js'
import type { Intent } from '../types/index.js'

const PLATFORMS = ['google-ads', 'instagram', 'tiktok', 'facebook', 'spotify'] as const

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: process.env.MCP_SERVER_NAME ?? 'footprint',
    version: '0.1.0',
  })

  server.tool(
    'record_intent',
    'Parse natural language text and store the user\'s advertising intents (wants, existing subscriptions, revocations).',
    {
      text: z.string().min(1).describe('Natural language input, e.g. "I want trail running shoes"'),
      userId: z.string().min(1).describe('Unique identifier for the user'),
    },
    async ({ text, userId }) => {
      const intents = await recordIntents(userId, text)
      if (intents.length === 0) {
        return { content: [{ type: 'text', text: 'No actionable intents found in the input.' }] }
      }
      return { content: [{ type: 'text', text: JSON.stringify({ recorded: intents.length, intents }, null, 2) }] }
    }
  )

  server.tool(
    'revoke_intent',
    'Mark a previously recorded intent as inactive. Provide intentId (exact) or item (fuzzy match).',
    {
      userId: z.string().min(1),
      intentId: z.string().uuid().optional().describe('UUID of the specific intent to revoke'),
      item: z.string().min(1).optional().describe('Item name to fuzzy-match and revoke, e.g. "tent"'),
    },
    async ({ userId, intentId, item }) => {
      const revoked = await revokeIntentByIdOrItem(userId, intentId, item)
      if (revoked.length === 0) {
        return { content: [{ type: 'text', text: 'No matching active intents found to revoke.' }] }
      }
      return { content: [{ type: 'text', text: JSON.stringify({ revoked: revoked.length, intents: revoked }, null, 2) }] }
    }
  )

  server.tool(
    'list_intents',
    'List active intents for a user. Optionally filter by type (WANT, HAVE, REVOKED).',
    {
      userId: z.string().min(1),
      type: z.enum(['WANT', 'HAVE', 'REVOKED']).optional().describe('Filter by intent type'),
      activeOnly: z.boolean().default(true).describe('If false, include revoked/inactive intents too'),
    },
    async ({ userId, type, activeOnly }) => {
      const intents = await getUserIntents(userId, type as Intent['type'] | undefined, activeOnly)
      return { content: [{ type: 'text', text: JSON.stringify({ count: intents.length, intents }, null, 2) }] }
    }
  )

  server.tool(
    'get_ad_profile',
    "Get the complete advertising profile for a user — their wants, existing subscriptions, revocations, and platform sync status.",
    {
      userId: z.string().min(1),
    },
    async ({ userId }) => {
      const profile = await getAdProfile(userId)
      return { content: [{ type: 'text', text: JSON.stringify(profile, null, 2) }] }
    }
  )

  server.tool(
    'sync_to_platform',
    "Sync a user's active intents to a named ad platform.",
    {
      userId: z.string().min(1),
      platform: z.enum(PLATFORMS).describe('Ad platform to sync to'),
    },
    async ({ userId, platform }) => {
      const platformImpl = getPlatform(platform)
      if (!platformImpl) {
        return { content: [{ type: 'text', text: `Unknown platform: ${platform}` }] }
      }
      const intents = await listIntents(userId)
      const result = await platformImpl.sync(userId, intents)
      await Promise.all(
        intents.map((i) => recordSyncLog(i.id, platform, result.status === 'success' ? 'success' : 'pending', result))
      )
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] }
    }
  )

  server.tool(
    'toggle_platform',
    'Enable or disable a platform integration for a user.',
    {
      userId: z.string().min(1),
      platform: z.enum(PLATFORMS),
      enabled: z.boolean().describe('true to enable, false to disable'),
    },
    async ({ userId, platform, enabled }) => {
      const config = await upsertPlatformConfig(userId, platform, enabled)
      return { content: [{ type: 'text', text: JSON.stringify(config, null, 2) }] }
    }
  )

  server.tool(
    'list_platforms',
    'List all available ad platform integrations.',
    {
      userId: z.string().min(1),
    },
    async (_args) => {
      const names = listPlatformNames()
      return { content: [{ type: 'text', text: JSON.stringify({ platforms: names }, null, 2) }] }
    }
  )

  return server
}
