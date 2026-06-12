import type { Poplatnik, PrichoziPlatba } from './types'

const JMENA = [
  'Novák', 'Svoboda', 'Novotný', 'Dvořák', 'Černý', 'Procházka', 'Kučera',
  'Veselý', 'Horák', 'Němec', 'Marek', 'Pospíšil', 'Pokorný', 'Hájek',
  'Král', 'Jelínek', 'Růžička', 'Beneš', 'Fiala', 'Sedláček', 'Doležal',
  'Zeman', 'Kolář', 'Navrátil', 'Čermák', 'Vaněk', 'Urban', 'Blažek',
  'Kříž', 'Holub', 'Mareš', 'Tichý', 'Bláha', 'Šťastný', 'Sýkora',
]
const KRESTNI = [
  'Jan', 'Petr', 'Marie', 'Eva', 'Tomáš', 'Lenka', 'Josef', 'Hana',
  'Václav', 'Jana', 'Martin', 'Alena', 'Roman', 'Petra', 'David',
  'Klára', 'Ondřej', 'Simona', 'Filip', 'Tereza',
]

// Sazby: psi 200 Kč; odpad 600 Kč/osoba (1–3 osoby).
function predpisFor(agenda: 'Psi' | 'Odpad', i: number): number {
  if (agenda === 'Psi') return 200
  return 600 * (1 + (i % 3)) // 600 / 1200 / 1800
}

function jmeno(i: number): string {
  return `${KRESTNI[i % KRESTNI.length]} ${JMENA[i % JMENA.length]}`
}

// 120 poplatníků, 27 nezaplacených (= 78 % uhrazeno), 9 dlužníků bez e-mailu.
const TOTAL = 120
const DEBTOR_EVERY = Math.floor(TOTAL / 27) // ~4 → každý ~4. je dlužník

export const SEED_POPLATKY: Poplatnik[] = Array.from({ length: TOTAL }, (_, i) => {
  const agenda: 'Psi' | 'Odpad' = i % 5 === 0 ? 'Psi' : 'Odpad'
  const predpis = predpisFor(agenda, i)
  // Spread debtors deterministically to land on exactly 27.
  const debtorIndex = Math.floor(i / DEBTOR_EVERY)
  const isDebtor = i % DEBTOR_EVERY === 0 && debtorIndex < 27
  const noEmail = isDebtor && debtorIndex % 3 === 0 && debtorIndex < 27 // ~9 bez e-mailu
  const jm = jmeno(i)
  return {
    id: `P-${String(i + 1).padStart(3, '0')}`,
    jmeno: jm,
    agenda,
    predpis,
    zaplaceno: !isDebtor,
    zaplaceno_at: isDebtor ? undefined : `${(i % 28) + 1}. ${(i % 3) + 1}. 2026`,
    poSplatnostiDni: isDebtor ? 30 + ((i * 7) % 44) : undefined, // 30–73 dní
    email: noEmail ? null : `${jm.toLowerCase().replace(/\s+/g, '.')}@email.cz`,
  }
})

// 3 příchozí platby bez rozpoznaného variabilního symbolu.
export const SEED_PRICHOZI_PLATBY: PrichoziPlatba[] = [
  {
    id: 'IN-2026-0411',
    castka: 200,
    datum: '8. 6. 2026',
    zprava: 'poplatek pes Benes',
    navrhJmeno: 'Karel Beneš',
    navrhDuvod: 'Částka 200 Kč i jméno ve zprávě odpovídá předpisu (psi).',
  },
  {
    id: 'IN-2026-0412',
    castka: 600,
    datum: '9. 6. 2026',
    zprava: 'odpad Rihova 2026',
    navrhJmeno: 'Michaela Říhová',
    navrhDuvod: 'Jméno ve zprávě i částka 600 Kč odpovídá předpisu (odpad).',
  },
  {
    id: 'IN-2026-0413',
    castka: 200,
    datum: '10. 6. 2026',
    zprava: 'platba B. Zemanova',
    navrhJmeno: 'Barbora Zemanová',
    navrhDuvod: 'Iniciála a příjmení ve zprávě odpovídá poplatníkovi (psi).',
  },
]
