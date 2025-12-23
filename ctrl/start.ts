import type { Handler } from 'hono'

import { round } from '../lib/round.ts'
import { insertStart } from '../db/fasting_log.ts'

export const start: Handler = async (c) => {
  const body = await c.req.parseBody()

  if (!body.time) {
    return c.text('Missing time', 400)
  }

  if (!body.date) {
    return c.text('Missing date', 400)
  }

  const roundedTime= round(body.time as string, 'up')
  insertStart.run(body.date as string, roundedTime)
  return c.json({ date: body.date, start: roundedTime })
}
