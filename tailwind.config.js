/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        racing: {
          bg: '#0A0D14',
          darker: '#06080D',
          card: '#111723',
          cardHover: '#161F2E',
          surface: '#1A2332',
          border: '#243044',
          borderLight: '#32415C',
          red: '#EE2737', // Authentic Racing Red
          redHover: '#D31F2E',
          redDark: '#8F111B',
          redGlow: 'rgba(238, 39, 55, 0.2)',
          amber: '#F59E0B',
          emerald: '#10B981',
          cyan: '#38BDF8',
          blue: '#2563EB',
          textMuted: '#94A3B8',
          textSubtle: '#64748B',
          telemetry: '#60A5FA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'red-glow': '0 0 20px -3px rgba(238, 39, 55, 0.35)',
        'cyan-glow': '0 0 20px -3px rgba(56, 189, 248, 0.35)',
        'amber-glow': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'racing-stripes': 'repeating-linear-gradient(45deg, rgba(238, 39, 55, 0.08), rgba(238, 39, 55, 0.08) 10px, transparent 10px, transparent 20px)',
        'carbon-mesh': 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0)',
        'telemetry-grid': 'linear-gradient(to right, rgba(56, 189, 248, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.03) 1px, transparent 1px)',
      }
    },
  },
  plugins: [],
}
