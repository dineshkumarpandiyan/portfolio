// ==============================
// SendMyStyle — Auth / Session
// Simple client-side session using localStorage.
// (Demo only — replace with a real backend later.)
// ==============================

const AUTH_KEY = "sms_user";

const Auth = {
  // Returns the logged-in user object, or null
  getUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    return !!this.getUser();
  },

  // Save a session. addresses default to the seed data if not provided.
  login(user) {
    const seedAddresses =
      typeof CURRENT_USER !== "undefined" && Array.isArray(CURRENT_USER.addresses) ? CURRENT_USER.addresses : [];
    const record = {
      name: user.name || "Member",
      email: user.email || "",
      addresses: user.addresses || seedAddresses,
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(record));
    return record;
  },

  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
};

// Resolve the correct relative base so links work from the root
// (index.html) and from inside /pages/*.html.
function basePath() {
  return window.location.pathname.includes("/pages/") ? ".." : ".";
}
