import type { Config } from "tailwindcss"
import scrollbar from "tailwind-scrollbar"

const config: Config = {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        /* Base */
        background: "hsl(var(--background))",
        surface: "hsl(var(--surface))",

        /* Text */
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",

        /* Border */
        border: "hsl(var(--border))",

        /* Primary */
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",

        /* ===== Estados Globales ===== */
        success: "hsl(var(--success))",
        "success-foreground": "hsl(var(--success-foreground))",

        danger: "hsl(var(--danger))",
        "danger-foreground": "hsl(var(--danger-foreground))",

        warning: "hsl(var(--warning))",
        "warning-foreground": "hsl(var(--warning-foreground))",

        info: "hsl(var(--info))",
        "info-foreground": "hsl(var(--info-foreground))",
      },

      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },

  plugins: [
    scrollbar,
  ],
}

export default config