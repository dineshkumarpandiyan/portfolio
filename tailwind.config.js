/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        role: "role 3s infinite ease-in-out",
        "role-dark": "role-dark 3s infinite ease-in-out",
      },
    },
  },
};
