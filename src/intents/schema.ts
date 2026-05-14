import { z } from 'zod'

export const IntentTypeSchema = z.enum(['WANT', 'HAVE', 'REVOKED'])

export const ParsedIntentSchema = z.object({
  type: IntentTypeSchema,
  category: z.string().min(1),
  item: z.string().min(1),
  brand: z.string().optional(),
  confidence: z.number().min(0).max(1),
})

export const RecordIntentInputSchema = z.object({
  text: z.string().min(1, 'text is required'),
  userId: z.string().min(1, 'userId is required'),
})

export const RevokeIntentInputSchema = z.object({
  userId: z.string().min(1),
  intentId: z.string().uuid().optional(),
  item: z.string().min(1).optional(),
}).refine((d) => d.intentId ?? d.item, {
  message: 'provide intentId or item',
})

export const ListIntentsInputSchema = z.object({
  userId: z.string().min(1),
  type: IntentTypeSchema.optional(),
  activeOnly: z.boolean().default(true),
})
