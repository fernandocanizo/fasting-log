import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'
import { index } from './control/index.ts'
import { start } from './control/start.ts'

const app = new Hono()

app.use('/css/*', serveStatic({ root: './pub' }))
app.use('/js/*', serveStatic({ root: './pub' }))

app.get('/', index)

app.post('/start', start)

Deno.serve(app.fetch)
