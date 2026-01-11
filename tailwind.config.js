/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'system-black': '#020617',  // The Void
        'system-panel': '#0f172a',  // Dark Metal
        'system-cyan': '#00f0ff',   // Mana Glow
        'system-red': '#ff003c',    // Danger/Alert
        'system-gold': '#ffd700',   // Rank S
        'system-dim': 'rgba(0, 240, 255, 0.1)',
      },
      fontFamily: {
        // We need a font that looks like a HUD. 'Rajdhani' is best.
        // Add this import to index.css: @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap');
        mono: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'holo': '0 0 10px rgba(0, 240, 255, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.1)',
        'danger': '0 0 10px rgba(255, 0, 60, 0.5), inset 0 0 20px rgba(255, 0, 60, 0.1)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)",
      },
      animation: {
        'scan': 'scan 4s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}