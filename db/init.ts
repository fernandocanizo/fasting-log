import { Database } from 'sqlite'

let db: Database | null = null

export const init = (): Database => {
  if (!db) {
    db = new Database('fasting.sqlite')

    db.exec(`CREATE TABLE IF NOT EXISTS fasting_log (
      date DATE,
      startTime TIME,
      endTime TIME
    )`)
  }

  return db
}
