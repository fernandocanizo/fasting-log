globalThis.fl = globalThis.fl || {};
const login = async () => {
  try {
    const store = globalThis.ds.signals;
    store.setSignal("isSubmitting", true);
    store.setSignal("loginError", "");
    const email = store.signal("email").value;
    const password = store.signal("password").value;
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    store.setSignal("isSubmitting", false);
    if (data.success) {
      globalThis.location.href = "/";
    } else {
      store.setSignal("loginError", data.error || "Login failed");
    }
  } catch (_error) {
    globalThis.ds.signals.setSignal("isSubmitting", false);
    globalThis.ds.signals.setSignal("loginError", "Connection error. Please try again.");
  }
};
globalThis.fl.login = login;
