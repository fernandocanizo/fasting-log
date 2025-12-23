import { Database } from 'sqlite'

const db = new Database('fasting.sqlite')

export const init = () => {
  if (db) {
    db.exec(`CREATE TABLE IF NOT EXISTS fasting_log (
      date DATE,
      startTime TIME,
      endTime TIME
    )`)

    return db
  }
}
