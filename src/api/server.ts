import express from 'express'
import intentsRouter from './routes/intents.js'
import platformsRouter from './routes/platforms.js'

const app = express()
app.use(express.json())

app.get('/health', (_req, res) => { res.json({ status: 'ok', service: 'footprint' }) })

app.use('/intents', intentsRouter)
app.use('/platforms', platformsRouter)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: err.message })
})

const port = Number(process.env.PORT ?? 3001)
app.listen(port, () => {
  console.log(`Footprint REST API listening on http://localhost:${port}`)
})

export default app
