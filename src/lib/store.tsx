import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import type { Report, Submission, SubmissionStatus, User } from './types'
import { MOCK_USER, SEED_REPORTS, SEED_SUBMISSIONS } from './mockData'

// A draft carries the citizen flow's data across screens (form → summary →
// payment → status) without touching the URL or any storage.
export interface Draft {
  kind: Submission['kind']
  title: string
  amount: number
  vs: string
  spdMessage: string
  detail: { label: string; value: string }[]
  backTo: string // hash of the form this draft came from (Summary „Zpět")
  // True for agendas with a fee (dog, waste); false for free submissions.
  requiresPayment: boolean
}

interface AppState {
  user: User | null
  submissions: Submission[]
  reports: Report[]
  notificationsEnabled: boolean
  draft: Draft | null
  activeId: string | null
  // Real elapsed seconds from login to the finished status screen.
  flowElapsedSec: number | null

  login: () => void
  logout: () => void
  startTimer: () => void
  stopTimer: () => number
  setDraft: (d: Draft | null) => void
  submitDraft: () => string // creates submission, returns its id
  markPaid: (id: string) => void
  advanceToDelivered: (id: string) => void
  setNotifications: (on: boolean) => void
  updateReportStatus: (id: string, status: SubmissionStatus) => void
  addReport: (r: Omit<Report, 'id' | 'createdAt' | 'status'>) => string
  updateSubmissionStatus: (
    id: string,
    status: SubmissionStatus,
    note: string,
  ) => void
}

const Ctx = createContext<AppState | null>(null)

let submissionSeq = 123 // next id → CTU-2026-000123
let reportSeq = 41

function nextSubmissionId(): string {
  const n = submissionSeq++
  return `CTU-2026-${n.toString().padStart(6, '0')}`
}
function nextReportId(): string {
  const n = reportSeq++
  return `PD-2026-${n.toString().padStart(5, '0')}`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>(SEED_SUBMISSIONS)
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [draft, setDraftState] = useState<Draft | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [flowElapsedSec, setFlowElapsedSec] = useState<number | null>(null)
  const startRef = useRef<number | null>(null)

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
    const sub: Submission = {
      id,
      kind: current.kind,
      title: current.title,
      citizen: user?.name ?? 'Jan Novák',
      amount: current.amount,
      status: 'novy',
      createdAt: '12. 6. 2026',
      paid: false,
      detail: current.detail,
    }
    setSubmissions((prev) => [sub, ...prev])
    setActiveId(id)
    return id
  }, [draft, user])

  const markPaid = useCallback((id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, paid: true } : s)),
    )
  }, [])

  const advanceToDelivered = useCallback((id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'reseni' } : s)),
    )
  }, [])

  const setNotifications = useCallback(
    (on: boolean) => setNotificationsEnabled(on),
    [],
  )

  const updateReportStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      )
    },
    [],
  )

  const addReport = useCallback(
    (r: Omit<Report, 'id' | 'createdAt' | 'status'>): string => {
      const id = nextReportId()
      const report: Report = {
        ...r,
        id,
        createdAt: '12. 6. 2026',
        status: 'novy',
      }
      setReports((prev) => [report, ...prev])
      return id
    },
    [],
  )

  const updateSubmissionStatus = useCallback(
    (id: string, status: SubmissionStatus, note: string) => {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status, officerNote: note } : s,
        ),
      )
    },
    [],
  )

  const value: AppState = {
    user,
    submissions,
    reports,
    notificationsEnabled,
    draft,
    activeId,
    flowElapsedSec,
    login,
    logout,
    startTimer,
    stopTimer,
    setDraft,
    submitDraft,
    markPaid,
    advanceToDelivered,
    setNotifications,
    updateReportStatus,
    addReport,
    updateSubmissionStatus,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
