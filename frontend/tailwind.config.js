/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          DEFAULT: '#E05C3A',
          lt: '#FAEAE4',
          md: '#F4C4B4',
        },
        nora: {
          bg: '#FDF6F3',
          card: '#FFFFFF',
          border: '#F0E8E4',
          text: '#1A1210',
          secondary: '#6B5650',
          muted: '#A8918A',
          success: '#2D9E6B',
          'success-lt': '#E8F5EE',
          danger: '#D94040',
          'danger-lt': '#FDEAEA',
          amber: '#C47A1A',
          'amber-lt': '#FDF3E0',
          accent: '#6366F1',
          'accent-lt': '#EEF2FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
}
