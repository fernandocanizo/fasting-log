globalThis.fl = globalThis.fl || {};
const login = async () => {
  try {
    $isSubmitting = true;
    $loginError = "";
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: $email, password: $password })
    });
    const data = await response.json();
    $isSubmitting = false;
    if (data.success) {
      globalThis.location.href = "/";
    } else {
      $loginError = data.error || "Login failed";
    }
  } catch (_error) {
    $isSubmitting = false;
    $loginError = "Connection error. Please try again.";
  }
};
globalThis.fl.login = login;
