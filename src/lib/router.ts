import { useSyncExternalStore, useCallback } from 'react'

// Minimal hash router. Path shape: #role/screen (+ optional /id).
// Example: #obcan/platba, #urednik/detail/CTU-2026-000122, #starosta/dashboard.

function getHash(): string {
  const h = window.location.hash.replace(/^#/, '')
  return h || 'obcan/uvod'
}

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export function navigate(path: string) {
  window.location.hash = path
  // Scroll the citizen column / dashboard back to the top on every transition.
  window.scrollTo({ top: 0 })
}

export interface Route {
  role: string
  screen: string
  param?: string
  parts: string[]
}

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, getHash)
  const parts = hash.split('/').filter(Boolean)
  return {
    role: parts[0] ?? 'obcan',
    screen: parts[1] ?? 'uvod',
    param: parts[2],
    parts,
  }
}

export function useNavigate() {
  return useCallback(navigate, [])
}
