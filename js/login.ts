// Type definitions for Datastar signals
declare let $isSubmitting: boolean
declare let $loginError: string
declare let $email: string
declare let $password: string

// API response types
interface LoginResponse {
  success: boolean
  error?: string
}

// Fasting Log namespace interface
interface FastingLogNamespace {
  login?: () => Promise<void>
}

// Extend globalThis to include our namespace
declare global {
  var fl: FastingLogNamespace
}

// Initialize or get existing fl namespace
globalThis.fl = globalThis.fl || {}

const login = async (): Promise<void> => {
  try {
    $isSubmitting = true
    $loginError = ""

    const response: Response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: $email, password: $password }),
    })

    const data: LoginResponse = await response.json()
    $isSubmitting = false

    if (data.success) {
      globalThis.location.href = "/"
    } else {
      $loginError = data.error || "Login failed"
    }
  } catch (_error: unknown) {
    $isSubmitting = false
    $loginError = "Connection error. Please try again."
  }
}

// Add login function to fl namespace
globalThis.fl.login = login
