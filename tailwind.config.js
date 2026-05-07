/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette derived from the Sprouty logo
        sprout: {
          50:  '#F1F8E9',
          100: '#DCEDC8',
          200: '#C5E1A5',
          300: '#AED581',
          400: '#9CCC65', // leaf bright
          500: '#7CB342', // logo leaf primary
          600: '#689F38',
          700: '#558B2F', // wordmark color  ← buttons / active state
          800: '#33691E',
          900: '#1B5E20',
        },
        gold: {
          400: '#F2C94C',
          500: '#D4A017',
          600: '#B5870E',
        },
        ink: {
          900: '#1A1A1A',
          700: '#3F3F3F',
          500: '#737373',
          300: '#D1D1D1',
          100: '#EEEEEE',
          50:  '#F5F5F5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
        elevated: '0 4px 16px rgba(85, 139, 47, 0.18)',
      },
    },
  },
  plugins: [],
};
