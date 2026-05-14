import { getPlatform, listPlatformNames } from '../../platforms/registry.js'
import { upsertPlatformConfig, listIntents } from '../../db/queries.js'
import { recordSyncLog } from '../../db/queries.js'

export const platformTools = [
  {
    name: 'sync_to_platform',
    description: 'Sync a user\'s active intents to a named ad platform. Returns the platform\'s sync result.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
        platform: {
          type: 'string',
          enum: ['google-ads', 'instagram', 'tiktok', 'facebook', 'spotify'],
          description: 'Ad platform to sync to',
        },
      },
      required: ['userId', 'platform'],
    },
    handler: async (args: { userId: string; platform: string }) => {
      const platformImpl = getPlatform(args.platform)
      if (!platformImpl) {
        return { content: [{ type: 'text', text: `Unknown platform: ${args.platform}` }] }
      }

      const intents = await listIntents(args.userId)
      const result = await platformImpl.sync(args.userId, intents)

      await Promise.all(
        intents.map((intent) =>
          recordSyncLog(intent.id, args.platform, result.status === 'success' ? 'success' : 'pending', result)
        )
      )

      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result, null, 2),
        }],
      }
    },
  },

  {
    name: 'toggle_platform',
    description: 'Enable or disable a platform integration for a user.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
        platform: {
          type: 'string',
          enum: ['google-ads', 'instagram', 'tiktok', 'facebook', 'spotify'],
        },
        enabled: { type: 'boolean', description: 'true to enable, false to disable' },
      },
      required: ['userId', 'platform', 'enabled'],
    },
    handler: async (args: { userId: string; platform: string; enabled: boolean }) => {
      const config = await upsertPlatformConfig(args.userId, args.platform, args.enabled)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(config, null, 2),
        }],
      }
    },
  },

  {
    name: 'list_platforms',
    description: 'List all available ad platform integrations and their current enabled status for a user.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
      },
      required: ['userId'],
    },
    handler: async (_args: { userId: string }) => {
      const names = listPlatformNames()
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ platforms: names }, null, 2),
        }],
      }
    },
  },
] as const
