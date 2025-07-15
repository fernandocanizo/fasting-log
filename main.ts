import type { Context } from "https://deno.land/x/oak/mod.ts"

import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { load } from "@std/dotenv"
import { verifyPassword } from "./util/hash-password.ts"

await load({ export: true })

const app = new Application()
const router = new Router()

// Simple in-memory session store
const sessions = new Map<string, { authenticated: boolean }>()

// Generate simple session ID
const generateSessionId = (): string => {
  return crypto.randomUUID()
}

// Authentication middleware
const requireAuth = async (
  context: Context,
  next: () => Promise<unknown>,
): Promise<void> => {
  const sessionId = await context.cookies.get("sessionId")
  const session = sessionId ? sessions.get(sessionId) : null

  if (!session?.authenticated) {
    context.response.redirect("/login")
    return
  }

  await next()
}

// Login endpoint
router.post("/api/login", async (context) => {
  const body = context.request.body
  const { email, password } = await body.json()

  const validEmail = Deno.env.get("LOGIN_EMAIL")
  const validPasswordHash = Deno.env.get("LOGIN_PASSWORD")

  if (!validEmail || !validPasswordHash) {
    context.response.status = 500
    context.response.body = {
      success: false,
      error: "Server configuration error",
    }
    return
  }

  const emailMatches = email === validEmail
  const passwordMatches = await verifyPassword(password, validPasswordHash)

  if (emailMatches && passwordMatches) {
    const sessionId = generateSessionId()
    sessions.set(sessionId, { authenticated: true })
    context.cookies.set("sessionId", sessionId, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
    })
    context.response.body = { success: true }
  } else {
    context.response.status = 401
    context.response.body = { success: false, error: "Invalid credentials" }
  }
})

// Logout endpoint
router.post("/api/logout", async (context) => {
  const sessionId = await context.cookies.get("sessionId")
  if (sessionId) {
    sessions.delete(sessionId)
    context.cookies.delete("sessionId")
  }
  context.response.body = { success: true }
})

// Check auth status endpoint
router.get("/api/auth-status", async (context) => {
  const sessionId = await context.cookies.get("sessionId")
  const session = sessionId ? sessions.get(sessionId) : null
  context.response.body = { authenticated: !!session?.authenticated }
})

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

// CSS file serving
router.get("/css/:filename", async (context) => {
  const filename = context.params.filename
  await context.send({
    root: `${Deno.cwd()}/css`,
    path: filename,
  })
})

// JS file serving
router.get("/js/:filename", async (context) => {
  const filename = context.params.filename
  await context.send({
    root: `${Deno.cwd()}/js`,
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
