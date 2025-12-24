import { init } from '~/db/init.ts'

const db = init()

export const insertStart = db.prepare(
  'INSERT INTO fasting_log ("date", "startTime") VALUES (?, ?) ON CONFLICT(date) DO UPDATE SET startTime = excluded.startTime',
)

export const insertStop = db.prepare(
  'UPDATE fasting_log SET endTime = ? WHERE date = ?',
)
