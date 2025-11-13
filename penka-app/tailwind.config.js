/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1173d4",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "foreground-light": "#101922",
        "foreground-dark": "#f6f7f8",
        "input-light": "#e9ebec",
        "input-dark": "#233648",
        "subtle-light": "#9ca3af",
        "subtle-dark": "#92adc9",
        "text-light": "#f6f7f8",
        "text-dark": "#101922",
        "neutral-light": "#e3e5e8",
        "neutral-dark": "#364352",
      },
      fontFamily: {
        "display": ["Plus Jakarta Sans", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
