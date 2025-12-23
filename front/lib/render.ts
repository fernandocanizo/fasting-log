import ejs from 'ejs'

export const render = (
  path: URL,
  data: Record<string, string>,
): Promise<string> =>
  new Promise((resolve, reject) => {
    ejs.renderFile(path.pathname, data, (error, html) => {
      if (error || !html) {
        reject(error ?? new Error('Template render failed'))
        return
      }
      resolve(html)
    })
  })
