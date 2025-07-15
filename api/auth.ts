import type { Context } from "https://deno.land/x/oak/mod.ts"

import { Router } from "https://deno.land/x/oak/mod.ts"
import { verifyPassword } from "../util/hash-password.ts"

// Simple in-memory session store
const sessions = new Map<string, { authenticated: boolean }>()

// Generate simple session ID
const generateSessionId = (): string => {
  return crypto.randomUUID()
}

// Authentication middleware
export const requireAuth = async (
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

// Create auth router
export const createAuthRouter = (): Router => {
  const router = new Router()

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

  return router
}
