import { Router } from 'express'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { listPlatformNames, getPlatform } from '../../platforms/registry.js'
import { upsertPlatformConfig, listIntents } from '../../db/queries.js'
import { recordSyncLog } from '../../db/queries.js'

const router = Router()

router.get('/', (_req: Request, res: Response) => {
  res.json({ platforms: listPlatformNames() })
})

const ToggleSchema = z.object({
  userId: z.string().min(1),
  platform: z.string().min(1),
  enabled: z.boolean(),
})

router.patch('/toggle', async (req: Request, res: Response) => {
  const parse = ToggleSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() })
    return
  }
  const config = await upsertPlatformConfig(parse.data.userId, parse.data.platform, parse.data.enabled)
  res.json(config)
})

const SyncSchema = z.object({
  userId: z.string().min(1),
  platform: z.string().min(1),
})

router.post('/sync', async (req: Request, res: Response) => {
  const parse = SyncSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() })
    return
  }
  const platformImpl = getPlatform(parse.data.platform)
  if (!platformImpl) {
    res.status(404).json({ error: `Unknown platform: ${parse.data.platform}` })
    return
  }
  const intents = await listIntents(parse.data.userId)
  const result = await platformImpl.sync(parse.data.userId, intents)
  await Promise.all(
    intents.map((i) => recordSyncLog(i.id, parse.data.platform, result.status === 'success' ? 'success' : 'pending', result))
  )
  res.json(result)
})

export default router
