import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { load } from "@std/dotenv"
import { createAuthRouter, requireAuth } from "./api/auth.ts"

await load({ export: true })

const app = new Application()
const router = new Router()

// Add auth routes
const authRouter = createAuthRouter()
app.use(authRouter.routes())
app.use(authRouter.allowedMethods())

// Login page route
router.get("/login", async (context) => {
  await context.send({
    root: `${Deno.cwd()}/view`,
    path: "login.html",
  })
})

// Main app route (protected)
router.get("/", requireAuth, async (context) => {
  await context.send({
    root: `${Deno.cwd()}/view`,
    path: "index.html",
  })
})

// CSS file serving (serve built files from dist/css)
router.get("/css/:filename", async (context) => {
  const filename = context.params.filename
  await context.send({
    root: `${Deno.cwd()}/dist/css`,
    path: filename,
  })
})

// JS file serving (serve built files from dist/js)
router.get("/js/:filename", async (context) => {
  const filename = context.params.filename
  await context.send({
    root: `${Deno.cwd()}/dist/js`,
    path: filename,
  })
})

// Static file serving for other assets
router.get("/static/:filename", async (context) => {
  const filename = context.params.filename
  await context.send({
    root: `${Deno.cwd()}/view/static`,
    path: filename,
  })
})

app.use(router.routes())
app.use(router.allowedMethods())

const PORT = 3500
console.log(`Server running on http://localhost:${PORT}`)
await app.listen({ port: PORT })
