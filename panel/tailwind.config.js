/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spatial: {
          950: '#06080D',
          900: '#0A0E17',
          850: '#0E1420',
          800: '#141C2B',
          700: '#1F2B40',
          600: '#2E3E5C'
        },
        cyber: {
          cyan: '#00E5FF',
          emerald: '#10B981',
          amber: '#F59E0B',
          crimson: '#EF4444',
          slate: '#64748B'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'glass-glow': '0 0 25px -5px rgba(0, 229, 255, 0.15)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }
    },
  },
  plugins: [],
}
