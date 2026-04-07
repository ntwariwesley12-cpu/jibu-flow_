const AUTH_USERS_KEY = "jibu_auth_users_v1";
const AUTH_SESSION_KEY = "jibu_auth_session_v1";
const AUTH_PAGE_PATH = "/jibu-flow/auth.html";

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || "null");
  } catch (e) {
    return null;
  }
}

function setSession(session) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

function hashPassword(password) {
  return btoa(unescape(encodeURIComponent(password)));
}

function normalizeWebsiteSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function getNextPage() {
  const qs = new URLSearchParams(window.location.search);
  const nextRaw = (qs.get("next") || "").trim();
  const normalized = nextRaw.toLowerCase().replace(/^\/+/, "");

  if (!normalized || normalized === "index.html") {
    return "/jibu-flow";
  }
  if (normalized === "jibu-flow") {
    return "/jibu-flow";
  }
  return nextRaw;
}

function showMessage(text, type) {
  const msg = document.getElementById("authMessage");
  if (!msg) return;
  msg.className = `auth-message ${type}`;
  msg.textContent = text;
}

function switchTab(tab) {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (!loginTab || !registerTab || !loginForm || !registerForm) return;

  const isLogin = tab === "login";
  loginTab.classList.toggle("active", isLogin);
  registerTab.classList.toggle("active", !isLogin);
  loginForm.classList.toggle("active", isLogin);
  registerForm.classList.toggle("active", !isLogin);
}

function initAuthPage() {
  const loginTab = document.getElementById("loginTab");
  const registerTab = document.getElementById("registerTab");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  if (!loginForm || !registerForm) return;

  const current = getSession();
  if (current) {
    window.location.href = getNextPage();
    return;
  }

  loginTab.addEventListener("click", () => switchTab("login"));
  registerTab.addEventListener("click", () => switchTab("register"));

  document.querySelectorAll(".toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-toggle-target");
      const input = targetId ? document.getElementById(targetId) : null;
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "🙈" : "👁";
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim().toLowerCase();
    const websiteName = document.getElementById("registerWebsiteName").value.trim();
    const websiteSlugInput = document.getElementById("registerWebsiteSlug");
    const websiteSlug = normalizeWebsiteSlug(websiteSlugInput.value);
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("registerPasswordConfirm").value;

    websiteSlugInput.value = websiteSlug;

    if (!name) {
      showMessage("Full name is required.", "error");
      return;
    }
    if (!websiteName) {
      showMessage("Website name is required.", "error");
      return;
    }
    if (websiteSlug.length < 3 || websiteSlug.length > 40) {
      showMessage("Website link name must be 3-40 characters.", "error");
      return;
    }
    if (password !== confirm) {
      showMessage("Passwords do not match.", "error");
      return;
    }
    if (password.length < 6) {
      showMessage("Password must be at least 6 characters.", "error");
      return;
    }

    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      showMessage("Account already exists. Please log in.", "error");
      switchTab("login");
      document.getElementById("loginEmail").value = email;
      return;
    }
    if (users.some((u) => (u.websiteSlug || "") === websiteSlug)) {
      showMessage("That website link name is already taken. Please choose another one.", "error");
      return;
    }

    users.push({
      name,
      email,
      websiteName,
      websiteSlug,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    });
    saveUsers(users);

    fetch("/api/auth/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name })
    })
      .then((res) => {
        if (!res.ok) {
          showMessage("Account created. Verification email is unavailable right now, but you can log in.", "success");
          return;
        }
        showMessage("Account created. Verification message sent to your email. You can now log in.", "success");
      })
      .catch(() => {
        showMessage("Account created. Verification email is unavailable right now, but you can log in.", "success");
      })
      .finally(() => {
        switchTab("login");
        document.getElementById("loginEmail").value = email;
        registerForm.reset();
      });
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPassword").value;
    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      clearSession();
      showMessage("No account found. Please create an account first.", "error");
      switchTab("register");
      document.getElementById("registerEmail").value = email;
      return;
    }

    if (user.passwordHash !== hashPassword(password)) {
      clearSession();
      loginForm.reset();
      showMessage("Wrong password. You have been logged out. Please create an account or use the correct password.", "error");
      switchTab("register");
      document.getElementById("registerEmail").value = email;
      return;
    }

    setSession({
      name: user.name,
      email: user.email,
      websiteName: user.websiteName || "",
      websiteSlug: user.websiteSlug || "",
      loginAt: new Date().toISOString()
    });
    showMessage("Login successful. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = getNextPage();
    }, 300);
  });
}

function enforceProtectedPage() {
  const page = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (page === "auth.html") return;
  const protectedPages = new Set([
    "index.html",
    "jibu-flow",
    "about.html",
    "products.html",
    "pricing.html",
    "testimonials.html",
    "faq.html",
    "contact.html",
    "settings.html",
    "indexjibu.html"
  ]);
  if (!protectedPages.has(page)) return;

  const session = getSession();
  if (!session) {
    const next = encodeURIComponent(page || "index.html");
    window.location.href = `${AUTH_PAGE_PATH}?next=${next}`;
    return;
  }

  const navList = document.querySelector(".nav-links");
  if (navList && !document.getElementById("authButtons")) {
    const container = document.createElement("div");
    container.id = "authButtons";
    container.style.display = "flex";
    container.style.gap = "0.5rem";
    container.style.alignItems = "center";

    if (session) {
      const userBtn = document.createElement("span");
      userBtn.className = "user-greeting";
      userBtn.textContent = `Hi, ${session.name || session.email} `;
      userBtn.style.marginRight = "0.5rem";
      userBtn.style.fontWeight = "600";

      const logoutLi = document.createElement("li");
      const logoutBtn = document.createElement("button");
      logoutBtn.id = "logoutBtn";
      logoutBtn.type = "button";
      logoutBtn.className = "btn btn-primary";
      logoutBtn.textContent = "Logout";
      logoutBtn.addEventListener("click", () => {
        clearSession();
        window.location.href = AUTH_PAGE_PATH;
      });
      logoutLi.appendChild(logoutBtn);
      container.appendChild(userBtn);
      container.appendChild(logoutLi);
    } else {
      const signInLi = document.createElement("li");
      const signInBtn = document.createElement("a");
      signInBtn.href = AUTH_PAGE_PATH;
      signInBtn.className = "btn btn-secondary";
      signInBtn.textContent = "Sign In";
      signInBtn.style.textDecoration = "none";
      signInLi.appendChild(signInBtn);
      container.appendChild(signInLi);
    }

    const authLi = document.createElement("li");
    authLi.appendChild(container);
    navList.appendChild(authLi);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm") && document.getElementById("registerForm")) {
    initAuthPage();
    return;
  }
  enforceProtectedPage();
});
