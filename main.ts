import { Application } from "https://deno.land/x/oak/mod.ts"

const app = new Application()

// Serve static files
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/view`,
    index: "index.html",
  })
})

const PORT = 3500
console.log(`Server running on http://localhost:${PORT}`)
await app.listen({ port: PORT })
