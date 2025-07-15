// API response types
interface LoginResponse {
  success: boolean
  error?: string
}

// Fasting Log namespace interface
interface FastingLogNamespace {
  login?: (ctx: any) => Promise<void>
}

// Extend globalThis to include our namespace
declare global {
  var fl: FastingLogNamespace
}

// Initialize or get existing fl namespace
globalThis.fl = globalThis.fl || {}

const login = async (ctx: any): Promise<void> => {
  try {
    // Access signals through the context parameter
    ctx.signals.setSignal("isSubmitting", true)
    ctx.signals.setSignal("loginError", "")

    const email = ctx.signals.signal("email").value
    const password = ctx.signals.signal("password").value

    const response: Response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data: LoginResponse = await response.json()
    ctx.signals.setSignal("isSubmitting", false)

    if (data.success) {
      globalThis.location.href = "/"
    } else {
      ctx.signals.setSignal("loginError", data.error || "Login failed")
    }
  } catch (_error: unknown) {
    ctx.signals.setSignal("isSubmitting", false)
    ctx.signals.setSignal("loginError", "Connection error. Please try again.")
  }
}

// Add login function to fl namespace
globalThis.fl.login = login
