import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { Database } from 'sqlite'
import ejs from 'ejs'
import { round } from './lib/round.ts'

const app = new Hono()
const db = new Database('fasting.sqlite')
const viewPath = new URL('./views/index.ejs', import.meta.url)
db.exec(`CREATE TABLE IF NOT EXISTS fasting_log (
  "date" DATE,
  "start" TIME,
  "end" TIME
)`)
const insertStart = db.prepare(
  'INSERT INTO fasting_log ("date", "start") VALUES (?, ?)',
)

app.use('/css/*', serveStatic({ root: './pub' }))
app.use('/js/*', serveStatic({ root: './pub' }))

const renderTemplate = (
  path: URL,
  data: Record<string, string>,
): Promise<string> =>
  new Promise((resolve, reject) => {
    ejs.renderFile(path.pathname, data, (error, html) => {
      if (error || !html) {
        reject(error ?? new Error('Template render failed'))
        return
      }
      resolve(html)
    })
  })

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

app.get('/', async (c) => {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const html = await renderTemplate(viewPath, { year, month, day })
  return c.html(html)
})

app.post('/start', async (c) => {
  const body = await c.req.parseBody()

  if (!body.time) {
    return c.text('Missing time', 400)
  }

  if (!body.date) {
    return c.text('Missing date', 400)
  }

  const roundedTime= round(body.time, 'up')
  insertStart.run(body.date, roundedTime)
  return c.json({ date: body.date, start: roundedTime })
})

Deno.serve(app.fetch)
