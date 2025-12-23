import { init } from '~/db/init.ts'

const db = init()

export const insertStart = db.prepare(
  'INSERT INTO fasting_log ("date", "startTime") VALUES (?, ?)',
)
