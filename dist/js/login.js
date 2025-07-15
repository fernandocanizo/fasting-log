globalThis.fl = globalThis.fl || {};
const login = async (ctx) => {
  try {
    ctx.signals.setSignal("isSubmitting", true);
    ctx.signals.setSignal("loginError", "");
    const email = ctx.signals.signal("email").value;
    const password = ctx.signals.signal("password").value;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    ctx.signals.setSignal("isSubmitting", false);
    if (data.success) {
      globalThis.location.href = "/";
    } else {
      ctx.signals.setSignal("loginError", data.error || "Login failed");
    }
  } catch (_error) {
    ctx.signals.setSignal("isSubmitting", false);
    ctx.signals.setSignal("loginError", "Connection error. Please try again.");
  }
};
globalThis.fl.login = login;
