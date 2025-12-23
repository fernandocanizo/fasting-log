import { Hono } from 'hono'

const app = new Hono()

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
        <section class="action">
          <button class="start-button">Start</button>
        </section>
      </main>
    </div>
    <script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></script>
  </body>
</html>`)
})

Deno.serve(app.fetch)
