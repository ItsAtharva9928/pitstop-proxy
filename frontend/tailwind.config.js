/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // App background (Level 0)
        background: '#121212',
        // Surfaces (Cards/Containers Level 1)
        surface: '#1E1E1E',
        // Floating elements (Modals Level 2)
        overlay: '#282828',
        // Accents
        primary: {
          DEFAULT: '#FF1801',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#00d2be',
          foreground: '#003731',
        },
        tertiary: {
          DEFAULT: '#fffb00',
          foreground: '#333200',
        },
        // Dividers / Borders
        border: '#2C2C2C',
        // Text
        text: {
          primary: '#e5e2e1',
          secondary: '#eabcb4',
        }
      },
      fontFamily: {
        display: ['ArchivoNarrow', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrainsMono', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        full: '9999px',
      }
    },
  },
  plugins: [],
}
