/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        whatsappGreen: '#25D366',
        stockBlue: '#007BFF',
        stockRed: '#DC3545'
      }
    }
  },
  plugins: []
};

