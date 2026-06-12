export type Role = 'obcan' | 'urednik' | 'starosta'

export type SubmissionStatus = 'novy' | 'reseni' | 'vyrizeno'

export type SubmissionKind = 'pes' | 'odpad' | 'obecne'

export interface TimelineStep {
  label: string
  // 'done' = filled circle, 'pending' = current pulse target, 'future' = greyed
  state: 'done' | 'pending' | 'future'
  time?: string // caption under the step, e.g. „14:32"
  note?: string // e.g. „obvykle do 5 dnů"
}

export interface Submission {
  id: string // CTU-2026-000123
  kind: SubmissionKind
  title: string
  citizen: string
  amount: number
  status: SubmissionStatus
  createdAt: string // formatted date
  paid: boolean
  // Free-form summary rows shown in the officer detail view.
  detail: { label: string; value: string }[]
  // Officer's resolution comment, once set.
  officerNote?: string
}

export type ReportCategory = 'Výtluk' | 'Osvětlení' | 'Skládka' | 'Jiné'

export interface Report {
  id: string // PD-2026-00042
  category: ReportCategory
  text: string
  email: string
  lat: number
  lng: number
  status: SubmissionStatus
  createdAt: string
  hasPhoto: boolean
  response?: string // obec's reply shown in the public map popup
}

export interface User {
  name: string
  born: number
  address: string
}
