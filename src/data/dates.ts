import { formatDate } from '../lib/format'

// Demo "today". Everything is computed relative to this so the dataset stays
// internally consistent regardless of when the demo is opened.
export const TODAY = new Date('2026-06-12T08:00:00')

export function daysAgo(n: number): Date {
  const d = new Date(TODAY)
  d.setDate(d.getDate() - n)
  return d
}

// Formatted date N days before "today".
export function dateAgo(n: number): string {
  return formatDate(daysAgo(n))
}
