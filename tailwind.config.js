/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';
import tailwindForms from '@tailwindcss/forms';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', 
  ],
  plugins: [
    tailwindScrollbar,
    tailwindForms
  ],
  darkMode: 'class',
};
