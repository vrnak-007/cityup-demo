// Amounts always render as „200 Kč" — thin space group separator, suffix Kč.
export function formatKc(value: number): string {
  const rounded = Math.round(value)
  const grouped = rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return `${grouped} Kč`
}

// Whole numbers with a non-breaking thousands separator (KPI counts).
export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

// Elapsed seconds → „2 min 14 s" / „48 s".
export function formatElapsed(seconds: number): string {
  const s = Math.max(0, Math.round(seconds))
  const m = Math.floor(s / 60)
  const rest = s % 60
  if (m === 0) return `${rest} s`
  return `${m} min ${rest} s`
}

// Short Czech date „4. 6. 2026".
export function formatDate(d: Date): string {
  return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()}`
}

// Time of day „14:32".
export function formatTime(d: Date): string {
  return `${d.getHours().toString().padStart(2, '0')}:${d
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
}
