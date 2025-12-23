import type { Handler } from 'hono'

import { render } from '../front/lib/render.ts'

export const index: Handler = async (c) => {
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const viewPath = new URL('../views/index.ejs', import.meta.url)

  const html = await render(viewPath, { year, month, day })
  return c.html(html)
}
