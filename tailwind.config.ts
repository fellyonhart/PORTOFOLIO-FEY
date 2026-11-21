import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        'bg-3': 'var(--bg-3)',
        card: 'var(--card)',
        'card-2': 'var(--card-2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        // Signature palette — tidak ada 'accent' supaya tidak ambigu
        ice: 'var(--ice)',
        lembayung: 'var(--lembayung)',
        pearl: 'var(--pearl)',
        gold: 'var(--gold)',
        'gold-deep': 'var(--gold-deep)',
        'tech-tag': 'var(--tech-tag)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      backgroundImage: {
        shift: 'var(--shift)',
      },
    },
  },
  plugins: [],
}

export default config
