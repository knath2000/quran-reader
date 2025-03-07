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
        primary: {
          DEFAULT: '#1e40af', // dark blue
          light: '#3b82f6',
          dark: '#1e3a8a',
        },
        secondary: {
          DEFAULT: '#7e22ce', // purple
          light: '#a855f7',
          dark: '#6b21a8',
        },
        accent: {
          DEFAULT: '#4f46e5', // indigo
          light: '#6366f1',
          dark: '#4338ca',
        },
        violet: {
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        midnight: {
          DEFAULT: '#121063', // very dark blue
          light: '#1e1b4b',
          dark: '#0f0d37',
        },
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        quranLight: {
          primary: '#1e40af',
          secondary: '#7e22ce',
          accent: '#4f46e5',
          neutral: '#2a323c',
          'base-100': '#f3f4f6',
          'base-200': '#e5e7eb',
          'base-300': '#d1d5db',
          'base-content': '#1f2937',
        },
        quranDark: {
          primary: '#3b82f6',
          secondary: '#a855f7',
          accent: '#6366f1',
          neutral: '#1f2937',
          'base-100': '#0f172a',
          'base-200': '#1e293b',
          'base-300': '#334155',
          'base-content': '#f8fafc',
        },
      },
    ],
  },
} 