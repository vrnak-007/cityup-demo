import type { Notifikace, Rezervace } from './types'

// The mock signed-in officer.
export const CURRENT_OFFICER = 'Nováková'

export const SEED_NOTIFIKACE: Notifikace[] = [
  { id: 'n1', typ: 'podani', text: 'Nové podání: Poplatek ze psů — Barbora Zemanová', kdy: 'před 20 min' },
  { id: 'n2', typ: 'platba', text: 'Příchozí platba 200 Kč bez variabilního symbolu', kdy: 'před 2 h' },
  { id: 'n3', typ: 'podnet', text: 'Nový podnět: Výtluk u prodejny potravin', kdy: 'dnes 7:42' },
  { id: 'n4', typ: 'podani', text: 'Podání po lhůtě: Stavební úřad — Václav Urban (14. den)', kdy: 'dnes 7:00' },
]

// Dnešní objednaní občané (karta na úvodu úředníka).
export const SEED_REZERVACE_DNES: Rezervace[] = [
  { cas: '8:30', agenda: 'Ověření podpisu', obcan: 'Jiří Pospíšil' },
  { cas: '9:00', agenda: 'Matrika', obcan: 'Klára Němcová' },
  { cas: '10:00', agenda: 'Ověření podpisu', obcan: 'Roman Fiala' },
  { cas: '11:00', agenda: 'Stavební úřad', obcan: 'Martin Kolář' },
  { cas: '14:00', agenda: 'Matrika', obcan: 'Tereza Bláhová' },
]

// Šablony zpráv při vrácení podání k doplnění.
export const SABLONY_VRACENI: { id: string; nazev: string; text: string }[] = [
  {
    id: 'cip',
    nazev: 'Chybí číslo čipu',
    text: 'Dobrý den, k dokončení přihlášení psa prosím doplňte 15místné číslo čipu z očkovacího průkazu. Děkujeme, Úřad obce Hvozdnice.',
  },
  {
    id: 'doklad',
    nazev: 'Chybí doklad úlevy',
    text: 'Dobrý den, pro uznání úlevy 50 % prosím doložte doklad o nároku (např. průkaz ZTP/P nebo doklad o věku). Děkujeme, Úřad obce Hvozdnice.',
  },
  {
    id: 'popis',
    nazev: 'Upřesnit popis',
    text: 'Dobrý den, prosíme o upřesnění popisu vašeho podání, abychom je mohli správně vyřídit. Děkujeme, Úřad obce Hvozdnice.',
  },
]
