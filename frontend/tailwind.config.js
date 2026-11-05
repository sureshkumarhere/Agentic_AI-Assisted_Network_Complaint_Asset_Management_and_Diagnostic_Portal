/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mnnit: {
          blue: '#002B5B',
          navy: '#001E3D',
          gold: '#E5A93C',
          amber: '#F59E0B',
          light: '#F8FAFC'
        },
        noc: {
          bg: '#0A0E17',
          panel: '#111827',
          surface: '#161F30',
          border: '#1F2937',
          'border-light': '#374151',
          highlight: '#2563EB',
          accent: '#3B82F6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'noc': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'noc-glow': '0 0 15px -3px rgba(37, 99, 235, 0.3)',
        'noc-emerald': '0 0 12px -2px rgba(16, 185, 129, 0.3)'
      }
    },
  },
  plugins: [],
}
