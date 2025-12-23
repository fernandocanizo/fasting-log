import { Hono } from 'hono'
import { Database } from 'sqlite'
import { round } from './lib/round.ts'

const app = new Hono()
const db = new Database('fasting.sqlite')
db.exec(`CREATE TABLE IF NOT EXISTS fasting_log (
  date DATE,
  "start" TIME,
  "end" TIME
)`)
const insertStart = db.prepare(
  'INSERT INTO fasting_log (date, "start") VALUES (?, ?)',
)

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const saveStartTime = (time: string): { date: string; start: string } => {
  const date = formatDate(new Date())
  const rounded = round(time, 'up')
  insertStart.run(date, rounded)
  return { date, start: rounded }
}

app.get('/', (c) => {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return c.html(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Fasting Log</title>
    <style>
      :root {
        --date-size: 12vw;
        --start-size: 6vw;
        --icon-size: 28px;
      }

      @media (min-width: 600px) {
        :root {
          --date-size: 8vw;
          --start-size: 4vw;
          --icon-size: 32px;
        }
      }

      @media (min-width: 900px) {
        :root {
          --date-size: 6vw;
          --start-size: 3vw;
          --icon-size: 36px;
        }
      }

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html,
      body {
        height: 100%;
      }

      body {
        font-family: "Avenir Next", "Gill Sans", "Trebuchet MS", sans-serif;
        background: #f6f4f0;
        color: #1c1c1c;
      }

      .screen {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 24px;
      }

      .top-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .icon-button {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: var(--icon-size);
        line-height: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
      }

      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .date {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-weight: 600;
        font-size: var(--date-size);
        line-height: 1.05;
        letter-spacing: 0.08em;
      }

      .action {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .start-button {
        width: clamp(160px, 28vh, 260px);
        height: clamp(160px, 28vh, 260px);
        border-radius: 999px;
        border: none;
        background: #35b266;
        color: #fff;
        font-size: var(--start-size);
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 12px 24px rgba(53, 178, 102, 0.3);
      }
    </style>
  </head>
  <body>
    <div class="screen">
      <header class="top-bar">
        <button class="icon-button" aria-label="Show statistics">
          <span class="iconify" data-icon="mdi:chart-bar" aria-hidden="true"></span>
        </button>
        <button class="icon-button" aria-label="Edit entry">
          <span class="iconify" data-icon="mdi:pencil" aria-hidden="true"></span>
        </button>
      </header>
      <main class="content">
        <section class="date" aria-label="Current date">
          <span>${year}</span>
          <span>${month}</span>
          <span>${day}</span>
        </section>
        <form
          class="action"
          id="start-form"
          hx-post="/start"
          hx-swap="none"
        >
          <input type="hidden" name="time" id="start-time" />
          <button class="start-button" type="submit">Start</button>
        </form>
      </main>
    </div>
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
    <script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></script>
    <script>
      const startForm = document.getElementById('start-form')
      const startTimeInput = document.getElementById('start-time')

      if (startForm && startTimeInput) {
        startForm.addEventListener('submit', () => {
          const now = new Date()
          const hours = String(now.getHours()).padStart(2, '0')
          const minutes = String(now.getMinutes()).padStart(2, '0')
          startTimeInput.value = hours + ':' + minutes
        })
      }
    </script>
  </body>
</html>`)
})

app.post('/start', async (c) => {
  const body = await c.req.parseBody()
  const time = typeof body.time === 'string' ? body.time : ''

  if (!time) {
    return c.text('Missing time', 400)
  }

  const saved = saveStartTime(time)
  return c.json(saved)
})

Deno.serve(app.fetch)
