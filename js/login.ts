// API response types
interface LoginResponse {
  success: boolean
  error?: string
}

// Datastar API types
interface DatastarStore {
  signals: {
    signal: (name: string) => { value: any }
    setSignal: (name: string, value: any) => void
  }
}

// Fasting Log namespace interface
interface FastingLogNamespace {
  login?: () => Promise<void>
}

// Extend globalThis to include our namespace
declare global {
  var fl: FastingLogNamespace
  var ds: DatastarStore
}

// Initialize or get existing fl namespace
globalThis.fl = globalThis.fl || {}

const login = async (): Promise<void> => {
  try {
    // Access Datastar signals through the global ds object
    const store = globalThis.ds.signals
    
    store.setSignal("isSubmitting", true)
    store.setSignal("loginError", "")

    const email = store.signal("email").value
    const password = store.signal("password").value

    const response: Response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data: LoginResponse = await response.json()
    store.setSignal("isSubmitting", false)

    if (data.success) {
      globalThis.location.href = "/"
    } else {
      store.setSignal("loginError", data.error || "Login failed")
    }
  } catch (_error: unknown) {
    globalThis.ds.signals.setSignal("isSubmitting", false)
    globalThis.ds.signals.setSignal("loginError", "Connection error. Please try again.")
  }
}

// Add login function to fl namespace
globalThis.fl.login = login
