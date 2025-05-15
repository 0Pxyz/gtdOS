import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#9146FF', // Twitch purple
          foreground: '#E8D4FF',
        },
        secondary: {
          DEFAULT: '#00FFDD', // Neon cyan
          foreground: '#B2FFF5',
        },
        background: {
          DEFAULT: '#0F0F17', // Dark gaming background
          light: '#F5F5FA', // Light mode background
        },
        foreground: {
          DEFAULT: '#E6E6EC',
          light: '#1F1F2E',
        },
        muted: {
          DEFAULT: '#8B8B9B',
          foreground: '#6B6B7B',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
  darkMode: ['class'],
};

export default config;
