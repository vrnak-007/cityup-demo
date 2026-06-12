/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Restrict the spacing scale to the 8pt grid mandated by the design system.
    spacing: {
      0: '0px',
      1: '4px', // half-step, used only for hairline focus offsets / 1px nudges
      2: '8px',
      4: '16px',
      6: '24px',
      8: '32px',
      10: '40px', // control heights (compact buttons)
      12: '48px',
      16: '64px',
      // Larger structural sizes (all multiples of 8): media boxes, map heights,
      // and the fixed-footer clearance on form screens.
      32: '128px',
      40: '160px',
      72: '288px',
    },
    extend: {
      colors: {
        'gov-blue': 'var(--gov-blue)',
        'gov-blue-dark': 'var(--gov-blue-dark)',
        'gov-blue-tint': 'var(--gov-blue-tint)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        line: 'var(--line)',
        paper: 'var(--paper)',
        canvas: 'var(--canvas)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        display: ['28px', { lineHeight: '34px', fontWeight: '700' }],
        h2: ['20px', { lineHeight: '28px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '18px' }],
      },
      borderRadius: {
        card: '8px',
        btn: '6px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,.06)',
      },
      maxWidth: {
        form: '480px',
        app: '1100px',
      },
    },
  },
  plugins: [],
}
