import { Router } from 'express'
import type { Request, Response } from 'express'
import { RecordIntentInputSchema, RevokeIntentInputSchema, ListIntentsInputSchema } from '../../intents/schema.js'
import { recordIntents, revokeIntentByIdOrItem, getUserIntents } from '../../intents/service.js'

const router = Router()

router.post('/parse', async (req: Request, res: Response) => {
  const parse = RecordIntentInputSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() })
    return
  }
  const intents = await recordIntents(parse.data.userId, parse.data.text)
  res.json({ recorded: intents.length, intents })
})

router.get('/', async (req: Request, res: Response) => {
  const parse = ListIntentsInputSchema.safeParse({
    userId: req.query['userId'],
    type: req.query['type'],
    activeOnly: req.query['activeOnly'] === 'false' ? false : true,
  })
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() })
    return
  }
  const intents = await getUserIntents(parse.data.userId, parse.data.type, parse.data.activeOnly)
  res.json({ count: intents.length, intents })
})

router.delete('/revoke', async (req: Request, res: Response) => {
  const parse = RevokeIntentInputSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() })
    return
  }
  const revoked = await revokeIntentByIdOrItem(parse.data.userId, parse.data.intentId, parse.data.item)
  res.json({ revoked: revoked.length, intents: revoked })
})

export default router
