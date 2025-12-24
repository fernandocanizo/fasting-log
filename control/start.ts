import type { Handler } from 'hono'

import { round } from '~/back/lib/round.ts'
import { insertStart, insertStop } from '~/db/fasting_log.ts'

export const start: Handler = async (c) => {
  console.debug(JSON.stringify(c.req.path, null, 2))
  const body = await c.req.parseBody()

  if (!body.time) {
    return c.text('Missing time', 400)
  }

  if (!body.date) {
    return c.text('Missing date', 400)
  }

  const roundedTime = round(body.time as string, 'up')

  if (c.req.path === '/start') {
    insertStart.run(body.date as string, roundedTime)
    return c.json({ date: body.date, start: roundedTime })
  } else if (c.req.path === '/stop') {
    insertStop.run(body.date as string, roundedTime)
    return c.json({ date: body.date, stop: roundedTime })
  }

  return c.text('Failed to insert either start or stop times', 500)
}
