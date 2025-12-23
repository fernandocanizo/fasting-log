import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import ejs from 'ejs'
import { round } from './lib/round.ts'
import { insertStart } from './db/fasting_log.ts'
import { start } from './controller/start.ts'

const app = new Hono()

const viewPath = new URL('./views/index.ejs', import.meta.url)

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

app.get('/', async (c) => {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const html = await renderTemplate(viewPath, { year, month, day })
  return c.html(html)
})

app.post('/start', start)

Deno.serve(app.fetch)
