import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'

export type AgendaKey = 'psi' | 'odpad' | 'obecne' | 'podnety' | 'rezervace'

export interface Pozvanka {
  email: string
  role: 'Úředník' | 'Správce'
  agendy: string
}

export interface TenantConfig {
  // Krok 1 — obec
  ico: string
  nazev: string
  adresa: string
  isds: string
  znak: string | null // data URL náhledu
  email: string
  telefon: string
  aresLoaded: boolean
  // Krok 2 — adresa portálu
  subdomena: string
  vlastniDomena: string
  // Krok 3 — agendy
  agendy: Record<AgendaKey, boolean>
  // Krok 4 — sazby
  pesPrvni: number
  pesDalsi: number
  pesSleva: number
  pesSplatnost: string
  odpadOsoba: number
  // Krok 5 — platby
  ucet: string
  vsAgenda: string
  vsRok: string
  vsPoradi: string
  // Krok 6 — doručování
  spisovka: string
  isdsTested: boolean
  // Krok 7 — úředníci
  pozvanky: Pozvanka[]
  // Krok 8 — texty
  uvitaci: string
  paticka: string
  generovatOznameni: boolean
  // stav wizardu
  spusteno: boolean
}

const DEFAULT: TenantConfig = {
  ico: '',
  nazev: '',
  adresa: '',
  isds: '',
  znak: null,
  email: '',
  telefon: '',
  aresLoaded: false,
  subdomena: 'hvozdnice',
  vlastniDomena: '',
  agendy: { psi: true, odpad: true, obecne: true, podnety: true, rezervace: true },
  pesPrvni: 200,
  pesDalsi: 300,
  pesSleva: 50,
  pesSplatnost: '31. 3.',
  odpadOsoba: 600,
  ucet: '',
  vsAgenda: '13',
  vsRok: '26',
  vsPoradi: '0001',
  spisovka: '',
  isdsTested: false,
  pozvanky: [
    { email: 'novakova@hvozdnice.cz', role: 'Úředník', agendy: 'Psi, Odpad' },
  ],
  uvitaci:
    'Vítejte na portálu obce Hvozdnice. Vyřiďte si poplatky a podání z pohodlí domova, bez fronty na úřadě.',
  paticka: 'Obecní úřad Hvozdnice · podatelna@hvozdnice.cz · 257 000 000',
  generovatOznameni: true,
  spusteno: false,
}

const TOTAL_KROKU = 9

interface TenantState {
  cfg: TenantConfig
  set: <K extends keyof TenantConfig>(key: K, value: TenantConfig[K]) => void
  krok: number
  hotovo: number[]
  totalKroku: number
  goTo: (k: number) => void
  next: () => void
  prev: () => void
  markDone: (k: number) => void
  spustit: () => void
  // timer
  startTimer: () => void
  elapsedSec: () => number
  finalElapsed: number | null
  stopTimer: () => number
}

const Ctx = createContext<TenantState | null>(null)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [cfg, setCfg] = useState<TenantConfig>(DEFAULT)
  const [krok, setKrok] = useState(1)
  const [hotovo, setHotovo] = useState<number[]>([])
  const [finalElapsed, setFinalElapsed] = useState<number | null>(null)
  const startRef = useRef<number | null>(null)

  const set = useCallback(
    <K extends keyof TenantConfig>(key: K, value: TenantConfig[K]) => {
      setCfg((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const markDone = useCallback((k: number) => {
    setHotovo((prev) => (prev.includes(k) ? prev : [...prev, k]))
  }, [])

  const goTo = useCallback((k: number) => {
    setKrok(Math.max(1, Math.min(TOTAL_KROKU, k)))
    window.scrollTo({ top: 0 })
  }, [])

  const next = useCallback(() => {
    setHotovo((prev) => (prev.includes(krok) ? prev : [...prev, krok]))
    setKrok((k) => Math.min(TOTAL_KROKU, k + 1))
    window.scrollTo({ top: 0 })
  }, [krok])

  const prev = useCallback(() => {
    setKrok((k) => Math.max(1, k - 1))
    window.scrollTo({ top: 0 })
  }, [])

  const startTimer = useCallback(() => {
    if (startRef.current == null) startRef.current = performance.now()
  }, [])

  const elapsedSec = useCallback(() => {
    return startRef.current ? (performance.now() - startRef.current) / 1000 : 0
  }, [])

  const stopTimer = useCallback(() => {
    const sec = startRef.current
      ? (performance.now() - startRef.current) / 1000
      : 0
    setFinalElapsed(sec)
    return sec
  }, [])

  const spustit = useCallback(() => {
    setCfg((prev) => ({ ...prev, spusteno: true }))
  }, [])

  const value: TenantState = {
    cfg,
    set,
    krok,
    hotovo,
    totalKroku: TOTAL_KROKU,
    goTo,
    next,
    prev,
    markDone,
    spustit,
    startTimer,
    elapsedSec,
    finalElapsed,
    stopTimer,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useTenant(): TenantState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTenant must be used within TenantProvider')
  return ctx
}

export const AGENDA_META: { key: AgendaKey; nazev: string; popis: string; pravni: string }[] = [
  {
    key: 'psi',
    nazev: 'Psi',
    popis: 'Přihlášení psa a platba poplatku',
    pravni: 'Místní poplatek dle OZV č. 2/2024 a zák. č. 565/1990 Sb.',
  },
  {
    key: 'odpad',
    nazev: 'Odpad',
    popis: 'Poplatek za komunální odpad',
    pravni: 'Místní poplatek dle OZV č. 1/2024 a zák. č. 565/1990 Sb.',
  },
  {
    key: 'obecne',
    nazev: 'Obecné podání',
    popis: 'Žádost nebo podnět na úřad',
    pravni: 'Podání dle zák. č. 500/2004 Sb. (správní řád).',
  },
  {
    key: 'podnety',
    nazev: 'Podněty',
    popis: 'Nahlášení závady na mapě',
    pravni: 'Dobrovolná agenda obce.',
  },
  {
    key: 'rezervace',
    nazev: 'Rezervace',
    popis: 'Objednání na úřad',
    pravni: 'Dobrovolná agenda obce.',
  },
]
