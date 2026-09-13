function updateThemeIcon() {
  const isDark = document.documentElement.classList.contains("dark");

  document.querySelectorAll("[data-theme-icon]").forEach((icon) => {
    icon.classList.toggle("bx-moon", !isDark);
    icon.classList.toggle("bx-sun", isDark);
  });
}

// ==============================
// Theme Initialization
// ==============================

(() => {
  try {
    const theme = localStorage.getItem("theme");
    const isDark = theme === "dark" || (theme === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();

// ==============================
// Theme Toggle
// ==============================

function toggleDarkMode() {
  const root = document.documentElement;

  // Disable transitions during the switch so borders/backgrounds don't flicker.
  root.classList.add("theme-switching");

  const isDark = root.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  updateThemeIcon();

  // Re-enable transitions on the next frame, after the new theme has painted.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove("theme-switching"));
  });
}

// ==============================
// Shared Components
// ==============================

document.addEventListener("DOMContentLoaded", async () => {
  async function loadComponent(id, path) {
    const el = document.getElementById(id);

    if (!el) return;

    try {
      const response = await fetch(path);

      if (!response.ok) {
        throw new Error(`${path}: ${response.status}`);
      }

      el.innerHTML = await response.text();
    } catch (error) {
      console.error(error);
    }
  }

  await Promise.all([
    loadComponent("site-header", "components/header.html"),
    loadComponent("site-footer", "components/footer.html"),
  ]);

  updateThemeIcon();
});
