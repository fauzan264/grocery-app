/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        'emerald-900': '#064e3b',
        'emerald-200': '#bbf7d0',
        'amber-400': '#f59e0b',
        'red-500': '#ef4444',
        'slate-700': '#334155'
      }
    }
  },
  plugins: []
};
