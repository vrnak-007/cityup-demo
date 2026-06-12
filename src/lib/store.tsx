import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type { Report, SubmissionStatus, User } from './types'
import { MOCK_USER } from './mockData'
import type {
  Podani,
  PodaniStav,
  Poplatnik,
  PrichoziPlatba,
  Notifikace,
  Resitel,
} from '../data/types'
import { SEED_PODANI } from '../data/podani'
import { SEED_POPLATKY, SEED_PRICHOZI_PLATBY } from '../data/poplatky'
import { SEED_PODNETY } from '../data/podnety'
import {
  CURRENT_OFFICER,
  SEED_NOTIFIKACE,
  SEED_REZERVACE_DNES,
} from '../data/officer'

// A draft carries the citizen flow's data across screens.
export interface Draft {
  kind: 'pes' | 'odpad' | 'obecne'
  title: string
  amount: number
  vs: string
  spdMessage: string
  detail: { label: string; value: string }[]
  backTo: string
  requiresPayment: boolean
}

export interface ObcanZprava {
  id: string
  text: string
  kdy: string
}

interface AppState {
  // citizen
  user: User | null
  notificationsEnabled: boolean
  draft: Draft | null
  activeId: string | null
  flowElapsedSec: number | null
  obcanZpravy: ObcanZprava[]

  // back-office datasets
  podani: Podani[]
  poplatky: Poplatnik[]
  prichoziPlatby: PrichoziPlatba[]
  reports: Report[]
  notifikace: Notifikace[]
  currentOfficer: string
  rezervaceDnes: typeof SEED_REZERVACE_DNES

  // citizen actions
  login: () => void
  logout: () => void
  startTimer: () => void
  stopTimer: () => number
  setDraft: (d: Draft | null) => void
  submitDraft: () => string
  markPaid: (id: string) => void
  advanceToDelivered: (id: string) => void
  setNotifications: (on: boolean) => void
  hodnotitPodani: (id: string, hvezdy: number) => void

  // reports
  updateReportStatus: (id: string, status: SubmissionStatus) => void
  addReport: (r: Omit<Report, 'id' | 'createdAt' | 'status'>) => string
  mergeDuplicate: (keepId: string, dropId: string) => void

  // officer actions
  prevzitPodani: (id: string) => void
  predatPodani: (id: string, resitel: Resitel) => void
  schvalitVyridit: (id: string) => void
  vratitKDoplneni: (id: string, text: string) => void
  sparovatPlatbu: (platbaId: string) => void
}

const Ctx = createContext<AppState | null>(null)

const AGENDA_LABEL: Record<Draft['kind'], string> = {
  pes: 'Psi',
  odpad: 'Odpad',
  obecne: 'Obecné podání',
}
const AGENDA_ODBOR: Record<Draft['kind'], string> = {
  pes: 'Finanční odbor',
  odpad: 'Finanční odbor',
  obecne: 'Podatelna',
}

// Citizen-created ids start at 200 to avoid colliding with the seed (100–129).
let submissionSeq = 200
let reportSeq = 50
let zpravaSeq = 1
const nextSubmissionId = () =>
  `CTU-2026-${String(submissionSeq++).padStart(6, '0')}`
const nextReportId = () => `PD-2026-${String(reportSeq++).padStart(5, '0')}`

const TODAY = '12. 6. 2026'

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [draft, setDraftState] = useState<Draft | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [flowElapsedSec, setFlowElapsedSec] = useState<number | null>(null)
  const [obcanZpravy, setObcanZpravy] = useState<ObcanZprava[]>([])
  const startRef = useRef<number | null>(null)

  const [podani, setPodani] = useState<Podani[]>(SEED_PODANI)
  const [poplatky] = useState<Poplatnik[]>(SEED_POPLATKY)
  const [prichoziPlatby, setPrichoziPlatby] = useState<PrichoziPlatba[]>(
    SEED_PRICHOZI_PLATBY,
  )
  const [reports, setReports] = useState<Report[]>(SEED_PODNETY)
  const [notifikace] = useState<Notifikace[]>(SEED_NOTIFIKACE)

  const login = useCallback(() => setUser(MOCK_USER), [])
  const logout = useCallback(() => setUser(null), [])

  const startTimer = useCallback(() => {
    startRef.current = performance.now()
    setFlowElapsedSec(null)
  }, [])
  const stopTimer = useCallback(() => {
    const sec = startRef.current
      ? (performance.now() - startRef.current) / 1000
      : 0
    setFlowElapsedSec(sec)
    return sec
  }, [])

  const setDraft = useCallback((d: Draft | null) => setDraftState(d), [])

  const submitDraft = useCallback((): string => {
    const id = nextSubmissionId()
    const current = draft
    if (!current) return id
    const p: Podani = {
      id,
      agenda: AGENDA_LABEL[current.kind],
      zadatel: user?.name ?? 'Jan Novák',
      email: 'jan.novak@email.cz',
      castka: current.amount,
      stav: 'novy',
      resitel: null,
      odbor: AGENDA_ODBOR[current.kind],
      podano_at: TODAY,
      podanoDni: 0,
      historie: [{ stav: 'Podáno', kdy: TODAY, kdo: 'Občan' }],
      detail: current.detail,
    }
    setPodani((prev) => [p, ...prev])
    setActiveId(id)
    return id
  }, [draft, user])

  const markPaid = useCallback((id: string) => {
    setPodani((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              stav: p.stav === 'novy' ? 'zaplaceno' : p.stav,
              historie: [
                ...p.historie,
                { stav: 'Zaplaceno', kdy: TODAY, kdo: 'Systém' },
              ],
            }
          : p,
      ),
    )
  }, [])

  // The citizen timeline animation is purely visual; officer state is unchanged.
  const advanceToDelivered = useCallback(() => {}, [])

  const setNotifications = useCallback(
    (on: boolean) => setNotificationsEnabled(on),
    [],
  )

  const hodnotitPodani = useCallback((id: string, hvezdy: number) => {
    setPodani((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hodnoceni: hvezdy } : p)),
    )
  }, [])

  const updateReportStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    },
    [],
  )

  const addReport = useCallback(
    (r: Omit<Report, 'id' | 'createdAt' | 'status'>): string => {
      const id = nextReportId()
      setReports((prev) => [
        { ...r, id, createdAt: TODAY, status: 'novy' },
        ...prev,
      ])
      return id
    },
    [],
  )

  const mergeDuplicate = useCallback((keepId: string, dropId: string) => {
    setReports((prev) =>
      prev
        .filter((r) => r.id !== dropId)
        .map((r) =>
          r.id === keepId
            ? { ...r, duplicitOf: undefined, duplicitVzdalenost: undefined }
            : r,
        ),
    )
  }, [])

  // --- officer actions ---
  const addKrok = (p: Podani, stav: string, komentar?: string): Podani => ({
    ...p,
    historie: [
      ...p.historie,
      { stav, kdy: TODAY, kdo: CURRENT_OFFICER, komentar },
    ],
  })

  const prevzitPodani = useCallback((id: string) => {
    setPodani((prev) =>
      prev.map((p) =>
        p.id === id
          ? addKrok(
              {
                ...p,
                resitel: CURRENT_OFFICER as Resitel,
                stav: 'reseni' as PodaniStav,
                prevzato_at: TODAY,
              },
              'Převzato',
            )
          : p,
      ),
    )
  }, [])

  const predatPodani = useCallback((id: string, resitel: Resitel) => {
    setPodani((prev) =>
      prev.map((p) =>
        p.id === id
          ? addKrok({ ...p, resitel }, 'Předáno', `Předáno řešiteli ${resitel}`)
          : p,
      ),
    )
  }, [])

  const schvalitVyridit = useCallback((id: string) => {
    setPodani((prev) =>
      prev.map((p) =>
        p.id === id
          ? addKrok(
              {
                ...p,
                stav: 'vyrizeno' as PodaniStav,
                vyrizeno_at: TODAY,
                dobaVyrizeniDni: p.podanoDni,
              },
              'Vyřízeno',
            )
          : p,
      ),
    )
  }, [])

  const vratitKDoplneni = useCallback((id: string, text: string) => {
    setPodani((prev) =>
      prev.map((p) =>
        p.id === id
          ? addKrok(
              { ...p, stav: 'vraceno' as PodaniStav },
              'Vráceno k doplnění',
              text,
            )
          : p,
      ),
    )
    // Mock notification to the citizen.
    setObcanZpravy((prev) => [
      {
        id: `z${zpravaSeq++}`,
        text: `Vaše podání ${id} bylo vráceno k doplnění. ${text}`,
        kdy: TODAY,
      },
      ...prev,
    ])
  }, [])

  const sparovatPlatbu = useCallback((platbaId: string) => {
    setPrichoziPlatby((prev) => prev.filter((x) => x.id !== platbaId))
  }, [])

  const value: AppState = {
    user,
    notificationsEnabled,
    draft,
    activeId,
    flowElapsedSec,
    obcanZpravy,
    podani,
    poplatky,
    prichoziPlatby,
    reports,
    notifikace,
    currentOfficer: CURRENT_OFFICER,
    rezervaceDnes: SEED_REZERVACE_DNES,
    login,
    logout,
    startTimer,
    stopTimer,
    setDraft,
    submitDraft,
    markPaid,
    advanceToDelivered,
    setNotifications,
    hodnotitPodani,
    updateReportStatus,
    addReport,
    mergeDuplicate,
    prevzitPodani,
    predatPodani,
    schvalitVyridit,
    vratitKDoplneni,
    sparovatPlatbu,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
