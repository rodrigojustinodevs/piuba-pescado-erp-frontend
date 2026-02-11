/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./pages/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16A34A",
        secondary: "#2563EB",
        background: "#F8FAFC",
        border: "#E5E7EB",
        "text-main": "#0F172A",
        "text-muted": "#64748B",
        // aliases (conforme nomes solicitados)
        textMain: "#0F172A",
        textMuted: "#64748B",
        success: "#22C55E",
        danger: "#EF4444",
      },
    },
  },
  plugins: [],
};
