import type { HistorieKrok, Podani, PodaniStav, Resitel } from './types'
import { dateAgo } from './dates'

const ODBOR: Record<string, string> = {
  Psi: 'Finanční odbor',
  Odpad: 'Finanční odbor',
  'Obecné podání': 'Podatelna',
  'Stavební úřad': 'Stavební úřad',
  'Ověření podpisu': 'Matrika',
}

interface Spec {
  agenda: keyof typeof ODBOR
  zadatel: string
  email: string
  castka: number
  stav: PodaniStav
  resitel: Resitel
  podanoDni: number
  prevzatoDni?: number
  vyrizenoDni?: number
  hodnoceni?: number
  vracenoKomentar?: string
}

let seq = 100
const mkId = () => `CTU-2026-${String(seq++).padStart(6, '0')}`

function buildHistorie(s: Spec): HistorieKrok[] {
  const h: HistorieKrok[] = [
    { stav: 'Podáno', kdy: dateAgo(s.podanoDni), kdo: 'Občan' },
  ]
  if (s.castka > 0 && s.stav !== 'novy') {
    h.push({ stav: 'Zaplaceno', kdy: dateAgo(s.podanoDni), kdo: 'Systém' })
  }
  if (s.prevzatoDni != null && s.resitel) {
    h.push({
      stav: 'Převzato',
      kdy: dateAgo(s.prevzatoDni),
      kdo: s.resitel,
      dobaKroku: `čekalo ${s.podanoDni - s.prevzatoDni} dní`,
    })
  }
  if (s.stav === 'vraceno' && s.resitel) {
    h.push({
      stav: 'Vráceno k doplnění',
      kdy: dateAgo((s.prevzatoDni ?? s.podanoDni) - 1),
      kdo: s.resitel,
      komentar: s.vracenoKomentar,
    })
  }
  if (s.stav === 'vyrizeno' && s.resitel && s.vyrizenoDni != null) {
    h.push({
      stav: 'Vyřízeno',
      kdy: dateAgo(s.vyrizenoDni),
      kdo: s.resitel,
      dobaKroku: `vyřízeno za ${s.podanoDni - s.vyrizenoDni} dní`,
    })
  }
  return h
}

function buildDetail(s: Spec): { label: string; value: string }[] {
  const base = [
    { label: 'Žadatel', value: s.zadatel },
    { label: 'Agenda', value: s.agenda },
    { label: 'Odbor', value: ODBOR[s.agenda] },
  ]
  if (s.castka > 0) base.push({ label: 'Částka', value: `${s.castka}` })
  return base
}

function build(s: Spec): Podani {
  return {
    id: mkId(),
    agenda: s.agenda,
    zadatel: s.zadatel,
    email: s.email,
    castka: s.castka,
    stav: s.stav,
    resitel: s.resitel,
    odbor: ODBOR[s.agenda],
    podano_at: dateAgo(s.podanoDni),
    podanoDni: s.podanoDni,
    prevzato_at: s.prevzatoDni != null ? dateAgo(s.prevzatoDni) : undefined,
    vyrizeno_at: s.vyrizenoDni != null ? dateAgo(s.vyrizenoDni) : undefined,
    dobaVyrizeniDni:
      s.vyrizenoDni != null ? s.podanoDni - s.vyrizenoDni : undefined,
    historie: buildHistorie(s),
    hodnoceni: s.hodnoceni,
    detail: buildDetail(s),
  }
}

// Distribution: 8 vyřízených, 12 v řešení (5 po lhůtě), 6 nepřevzatých, 4 vrácená.
const SPECS: Spec[] = [
  // --- 8 vyřízených (doba 1–9 dní), 6 s hodnocením ---
  { agenda: 'Odpad', zadatel: 'Jan Novák', email: 'jan.novak@email.cz', castka: 600, stav: 'vyrizeno', resitel: 'Nováková', podanoDni: 9, prevzatoDni: 8, vyrizenoDni: 7, hodnoceni: 5 },
  { agenda: 'Psi', zadatel: 'Marie Dvořáková', email: 'm.dvorakova@email.cz', castka: 200, stav: 'vyrizeno', resitel: 'Svoboda', podanoDni: 12, prevzatoDni: 11, vyrizenoDni: 10, hodnoceni: 5 },
  { agenda: 'Ověření podpisu', zadatel: 'Petr Svoboda', email: 'petr.s@email.cz', castka: 100, stav: 'vyrizeno', resitel: 'Dvořáková', podanoDni: 14, prevzatoDni: 13, vyrizenoDni: 5, hodnoceni: 4 },
  { agenda: 'Obecné podání', zadatel: 'Eva Horáková', email: 'e.horakova@email.cz', castka: 0, stav: 'vyrizeno', resitel: 'Nováková', podanoDni: 11, prevzatoDni: 10, vyrizenoDni: 9, hodnoceni: 5 },
  { agenda: 'Odpad', zadatel: 'Tomáš Král', email: 't.kral@email.cz', castka: 1200, stav: 'vyrizeno', resitel: 'Svoboda', podanoDni: 8, prevzatoDni: 7, vyrizenoDni: 6, hodnoceni: 5 },
  { agenda: 'Psi', zadatel: 'Lenka Marková', email: 'l.markova@email.cz', castka: 200, stav: 'vyrizeno', resitel: 'Nováková', podanoDni: 15, prevzatoDni: 14, vyrizenoDni: 11, hodnoceni: 3 },
  { agenda: 'Stavební úřad', zadatel: 'Josef Beneš', email: 'j.benes@email.cz', castka: 0, stav: 'vyrizeno', resitel: 'Dvořáková', podanoDni: 10, prevzatoDni: 9, vyrizenoDni: 8 },
  { agenda: 'Obecné podání', zadatel: 'Hana Pokorná', email: 'h.pokorna@email.cz', castka: 0, stav: 'vyrizeno', resitel: 'Svoboda', podanoDni: 7, prevzatoDni: 6, vyrizenoDni: 5 },

  // --- 12 v řešení: 3× >10 dní, 2× >5 dní (= 5 po lhůtě), zbytek v lhůtě ---
  { agenda: 'Stavební úřad', zadatel: 'Václav Urban', email: 'v.urban@email.cz', castka: 0, stav: 'reseni', resitel: 'Nováková', podanoDni: 14, prevzatoDni: 12 },
  { agenda: 'Obecné podání', zadatel: 'Jana Tichá', email: 'j.ticha@email.cz', castka: 0, stav: 'reseni', resitel: 'Svoboda', podanoDni: 12, prevzatoDni: 10 },
  { agenda: 'Stavební úřad', zadatel: 'Martin Kolář', email: 'm.kolar@email.cz', castka: 0, stav: 'reseni', resitel: 'Nováková', podanoDni: 11, prevzatoDni: 9 },
  { agenda: 'Odpad', zadatel: 'Alena Veselá', email: 'a.vesela@email.cz', castka: 600, stav: 'reseni', resitel: 'Dvořáková', podanoDni: 7, prevzatoDni: 5 },
  { agenda: 'Psi', zadatel: 'Roman Fiala', email: 'r.fiala@email.cz', castka: 200, stav: 'reseni', resitel: 'Svoboda', podanoDni: 6, prevzatoDni: 4 },
  { agenda: 'Obecné podání', zadatel: 'Petra Sedláčková', email: 'p.sedlackova@email.cz', castka: 0, stav: 'reseni', resitel: 'Nováková', podanoDni: 4, prevzatoDni: 3 },
  { agenda: 'Odpad', zadatel: 'David Růžička', email: 'd.ruzicka@email.cz', castka: 1800, stav: 'reseni', resitel: 'Nováková', podanoDni: 3, prevzatoDni: 2 },
  { agenda: 'Stavební úřad', zadatel: 'Klára Němcová', email: 'k.nemcova@email.cz', castka: 0, stav: 'reseni', resitel: 'Svoboda', podanoDni: 3, prevzatoDni: 2 },
  { agenda: 'Ověření podpisu', zadatel: 'Ondřej Mareš', email: 'o.mares@email.cz', castka: 100, stav: 'reseni', resitel: 'Dvořáková', podanoDni: 2, prevzatoDni: 1 },
  { agenda: 'Psi', zadatel: 'Simona Kučerová', email: 's.kucerova@email.cz', castka: 200, stav: 'reseni', resitel: 'Nováková', podanoDni: 2, prevzatoDni: 1 },
  { agenda: 'Obecné podání', zadatel: 'Filip Procházka', email: 'f.prochazka@email.cz', castka: 0, stav: 'reseni', resitel: 'Svoboda', podanoDni: 4, prevzatoDni: 3 },
  { agenda: 'Odpad', zadatel: 'Tereza Bláhová', email: 't.blahova@email.cz', castka: 600, stav: 'reseni', resitel: 'Dvořáková', podanoDni: 1, prevzatoDni: 1 },

  // --- 6 nepřevzatých (resitel null) ---
  { agenda: 'Psi', zadatel: 'Karel Beneš', email: 'k.benes@email.cz', castka: 200, stav: 'zaplaceno', resitel: null, podanoDni: 6 },
  { agenda: 'Odpad', zadatel: 'Michaela Říhová', email: 'm.rihova@email.cz', castka: 600, stav: 'zaplaceno', resitel: null, podanoDni: 4 },
  { agenda: 'Obecné podání', zadatel: 'Pavel Doležal', email: 'p.dolezal@email.cz', castka: 0, stav: 'novy', resitel: null, podanoDni: 3 },
  { agenda: 'Stavební úřad', zadatel: 'Veronika Macháčková', email: 'v.machackova@email.cz', castka: 0, stav: 'novy', resitel: null, podanoDni: 2 },
  { agenda: 'Ověření podpisu', zadatel: 'Lukáš Holub', email: 'l.holub@email.cz', castka: 100, stav: 'zaplaceno', resitel: null, podanoDni: 2 },
  { agenda: 'Psi', zadatel: 'Barbora Zemanová', email: 'b.zemanova@email.cz', castka: 200, stav: 'novy', resitel: null, podanoDni: 1 },

  // --- 4 vrácená k doplnění ---
  { agenda: 'Psi', zadatel: 'Radek Vlček', email: 'r.vlcek@email.cz', castka: 200, stav: 'vraceno', resitel: 'Nováková', podanoDni: 9, prevzatoDni: 7, vracenoKomentar: 'Chybí číslo čipu psa.' },
  { agenda: 'Odpad', zadatel: 'Ivana Šťastná', email: 'i.stastna@email.cz', castka: 600, stav: 'vraceno', resitel: 'Svoboda', podanoDni: 8, prevzatoDni: 6, vracenoKomentar: 'Chybí doklad o nároku na úlevu.' },
  { agenda: 'Stavební úřad', zadatel: 'Jiří Pospíšil', email: 'j.pospisil@email.cz', castka: 0, stav: 'vraceno', resitel: 'Dvořáková', podanoDni: 10, prevzatoDni: 8, vracenoKomentar: 'Upřesněte popis stavebního záměru.' },
  { agenda: 'Obecné podání', zadatel: 'Monika Sýkorová', email: 'm.sykorova@email.cz', castka: 0, stav: 'vraceno', resitel: 'Nováková', podanoDni: 6, prevzatoDni: 5, vracenoKomentar: 'Doplňte přílohu uvedenou v textu.' },
]

export const SEED_PODANI: Podani[] = SPECS.map(build)
