import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        headline: ['Playfair Display', 'serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        // Explicit mango colors
        amber: {
          DEFAULT: '#FFB300',
          light: '#FFD060',
          dark: '#E87000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'mango-card': '28px',
        'mango-btn': '20px',
        'mango-input': '16px',
        'mango-tag': '20px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-18px) rotate(2deg)' },
        },
        'float-gentle': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.08)' },
        },
        'orbit-spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'match-bounce': {
          from: { opacity: '0', transform: 'scale(0.3)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'heart-pulse': {
          '0%, 100%': { transform: 'scale(1)', filter: 'drop-shadow(0 0 20px rgba(255,100,0,0.6))' },
          '50%': { transform: 'scale(1.12)', filter: 'drop-shadow(0 0 35px rgba(255,100,0,0.9))' },
        },
        'mango-wiggle': {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg) scale(1)' },
          '50%': { transform: 'translateY(-8px) rotate(3deg) scale(1.08)' },
        },
        'pack-in': {
          from: { opacity: '0', transform: 'scale(0.3) rotate(-10deg)' },
          to: { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'hero-in': {
          from: { opacity: '0', transform: 'scale(0.8) translateY(30px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'typing-bounce': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-6px)', opacity: '1' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-60px) rotate(0deg) scale(0.5)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(900px) rotate(360deg) scale(1.2)', opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-slow': 'pulse-slow 3s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'float-gentle': 'float-gentle 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
        'orbit': 'orbit-spin 20s linear infinite',
        'orbit-reverse': 'orbit-spin 30s linear infinite reverse',
        'match-bounce': 'match-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'heart-pulse': 'heart-pulse 1.5s ease-in-out infinite',
        'mango-wiggle': 'mango-wiggle 2s ease-in-out infinite',
        'pack-in': 'pack-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-up': 'slide-up 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-down': 'fade-down 1s cubic-bezier(0.16, 1, 0.3, 1) both',
        'hero-in': 'hero-in 1.2s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'typing-bounce': 'typing-bounce 1.2s ease-in-out infinite',
        'confetti-fall': 'confetti-fall linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
