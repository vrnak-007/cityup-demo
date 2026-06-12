// Rich back-office data model (Addon 2). Lives alongside the lighter citizen
// types in src/lib/types.ts.

export type PodaniStav =
  | 'novy' // přijato, nepřevzato
  | 'zaplaceno' // uhrazeno, nepřevzato
  | 'reseni' // V řešení (převzato řešitelem)
  | 'vraceno' // Vráceno k doplnění
  | 'vyrizeno' // Vyřízeno

export type Resitel = 'Nováková' | 'Svoboda' | 'Dvořáková' | null

export interface HistorieKrok {
  stav: string
  kdy: string // formatted date „5. 6. 2026"
  kdo: string // úředník / „Občan" / „Systém"
  komentar?: string
  dobaKroku?: string // „2 dny", caption pod krokem
}

export interface Podani {
  id: string
  agenda: string
  zadatel: string
  email: string
  castka: number
  stav: PodaniStav
  resitel: Resitel
  odbor: string
  podano_at: string // formatted
  podanoDni: number // dní od podání po dnešek (pro SLA)
  prevzato_at?: string
  vyrizeno_at?: string
  dobaVyrizeniDni?: number // u vyřízených: podání → vyřízení
  historie: HistorieKrok[]
  hodnoceni?: number // 1–5 hvězd (jen některá vyřízená)
  detail: { label: string; value: string }[]
}

export interface Poplatnik {
  id: string
  jmeno: string
  agenda: 'Psi' | 'Odpad'
  predpis: number
  zaplaceno: boolean
  zaplaceno_at?: string
  poSplatnostiDni?: number // u nezaplacených
  email: string | null // null → bez e-mailu (tisk do PDF)
}

export interface PrichoziPlatba {
  id: string
  castka: number
  datum: string
  zprava: string // zpráva pro příjemce
  navrhJmeno: string // pravděpodobný plátce
  navrhDuvod: string // „částka i jméno odpovídá"
}

export interface Notifikace {
  id: string
  typ: 'podani' | 'platba' | 'podnet'
  text: string
  kdy: string
}

export interface Rezervace {
  cas: string
  agenda: string
  obcan: string
}
