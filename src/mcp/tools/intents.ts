import { z } from 'zod'
import { recordIntents, revokeIntentByIdOrItem, getUserIntents, getAdProfile } from '../../intents/service.js'
import type { Intent } from '../../types/index.js'

export const intentTools = [
  {
    name: 'record_intent',
    description:
      'Parse natural language text and store the user\'s advertising intents (wants, existing subscriptions, revocations). Returns the list of structured intents that were extracted and saved.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        text: { type: 'string', description: 'Natural language input, e.g. "I want trail running shoes" or "I\'m already a Spotify customer"' },
        userId: { type: 'string', description: 'Unique identifier for the user' },
      },
      required: ['text', 'userId'],
    },
    handler: async (args: { text: string; userId: string }) => {
      const intents = await recordIntents(args.userId, args.text)
      if (intents.length === 0) {
        return { content: [{ type: 'text', text: 'No actionable intents found in the input.' }] }
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ recorded: intents.length, intents }, null, 2),
        }],
      }
    },
  },

  {
    name: 'revoke_intent',
    description:
      'Mark a previously recorded intent as revoked (user is no longer interested). Provide either intentId (exact) or item (fuzzy match by name).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
        intentId: { type: 'string', description: 'UUID of the specific intent to revoke' },
        item: { type: 'string', description: 'Item name to fuzzy-match and revoke, e.g. "tent"' },
      },
      required: ['userId'],
    },
    handler: async (args: { userId: string; intentId?: string; item?: string }) => {
      const revoked = await revokeIntentByIdOrItem(args.userId, args.intentId, args.item)
      if (revoked.length === 0) {
        return { content: [{ type: 'text', text: 'No matching active intents found to revoke.' }] }
      }
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ revoked: revoked.length, intents: revoked }, null, 2),
        }],
      }
    },
  },

  {
    name: 'list_intents',
    description: 'List active intents for a user. Optionally filter by type (WANT, HAVE, REVOKED).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
        type: { type: 'string', enum: ['WANT', 'HAVE', 'REVOKED'], description: 'Filter by intent type' },
        activeOnly: { type: 'boolean', description: 'If false, include revoked/inactive intents too (default: true)' },
      },
      required: ['userId'],
    },
    handler: async (args: { userId: string; type?: Intent['type']; activeOnly?: boolean }) => {
      const intents = await getUserIntents(args.userId, args.type, args.activeOnly ?? true)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ count: intents.length, intents }, null, 2),
        }],
      }
    },
  },

  {
    name: 'get_ad_profile',
    description: 'Get the complete advertising profile for a user — their wants, existing subscriptions, revocations, and platform sync status.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        userId: { type: 'string' },
      },
      required: ['userId'],
    },
    handler: async (args: { userId: string }) => {
      const profile = await getAdProfile(args.userId)
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(profile, null, 2),
        }],
      }
    },
  },
] as const
