import type { Report, ReportCategory } from '../lib/types'

// Kategorie → odbor (pravidlo pro auto-routing).
export const KATEGORIE_ODBOR: Record<ReportCategory, string> = {
  Výtluk: 'Doprava',
  Osvětlení: 'Správa majetku',
  Skládka: 'Životní prostředí',
  Jiné: 'Podatelna',
}

type Seed = Omit<Report, 'odbor'> & { category: ReportCategory }

const RAW: Seed[] = [
  {
    id: 'PD-2026-00031',
    category: 'Výtluk',
    text: 'Hluboký výtluk u zastávky, hrozí poškození kol.',
    email: 'obcan@email.cz',
    lat: 49.9325,
    lng: 14.4185,
    status: 'vyrizeno',
    createdAt: '28. 5. 2026',
    hasPhoto: true,
    response: 'Opraveno 4. 6. — děkujeme za nahlášení.',
    dniOtevreno: 7,
  },
  {
    id: 'PD-2026-00033',
    category: 'Osvětlení',
    text: 'Nesvítí lampa u dětského hřiště.',
    email: 'obcan@email.cz',
    lat: 49.9298,
    lng: 14.4231,
    status: 'reseni',
    createdAt: '1. 6. 2026',
    hasPhoto: true,
    response: 'Předáno správci VO, oprava plánována do 14 dnů.',
    dniOtevreno: 11,
  },
  {
    id: 'PD-2026-00035',
    category: 'Skládka',
    text: 'Černá skládka u lesní cesty za rybníkem.',
    email: 'soused@email.cz',
    lat: 49.9341,
    lng: 14.4256,
    status: 'novy',
    createdAt: '7. 6. 2026',
    hasPhoto: true,
    dniOtevreno: 5,
  },
  {
    id: 'PD-2026-00037',
    category: 'Výtluk',
    text: 'Rozbitý kanálový poklop v ulici K Lesu.',
    email: 'obcan@email.cz',
    lat: 49.9277,
    lng: 14.4162,
    status: 'reseni',
    createdAt: '8. 6. 2026',
    hasPhoto: false,
    response: 'Zajištěno provizorní označení, čekáme na nový poklop.',
    dniOtevreno: 4,
  },
  {
    id: 'PD-2026-00039',
    category: 'Jiné',
    text: 'Přerostlá zeleň zasahuje do chodníku.',
    email: 'obcan@email.cz',
    lat: 49.9312,
    lng: 14.4279,
    status: 'novy',
    createdAt: '10. 6. 2026',
    hasPhoto: true,
    dniOtevreno: 2,
  },
  {
    id: 'PD-2026-00040',
    category: 'Osvětlení',
    text: 'Blikající lampa na návsi.',
    email: 'soused@email.cz',
    lat: 49.9289,
    lng: 14.4205,
    status: 'vyrizeno',
    createdAt: '22. 5. 2026',
    hasPhoto: false,
    response: 'Vyměněn předřadník 30. 5. — opraveno.',
    dniOtevreno: 8,
  },
  // --- Duplicitní pár: dva Výtluky ~78 m od sebe ---
  {
    id: 'PD-2026-00042',
    category: 'Výtluk',
    text: 'Výmol v křižovatce u obchodu, auta se mu vyhýbají.',
    email: 'obcan@email.cz',
    lat: 49.9319,
    lng: 14.4192,
    status: 'novy',
    createdAt: '11. 6. 2026',
    hasPhoto: true,
    dniOtevreno: 1,
  },
  {
    id: 'PD-2026-00043',
    category: 'Výtluk',
    text: 'Velká díra ve vozovce u prodejny potravin.',
    email: 'jiny.obcan@email.cz',
    lat: 49.9326,
    lng: 14.4189,
    status: 'novy',
    createdAt: '12. 6. 2026',
    hasPhoto: false,
    dniOtevreno: 0,
  },
]

// Odbor se přidělí automaticky podle kategorie.
export const SEED_PODNETY: Report[] = RAW.map((r) => ({
  ...r,
  odbor: KATEGORIE_ODBOR[r.category],
}))

// Označ duplicitní pár (stejná kategorie, < 80 m).
const A = SEED_PODNETY.find((r) => r.id === 'PD-2026-00042')!
const B = SEED_PODNETY.find((r) => r.id === 'PD-2026-00043')!
A.duplicitOf = B.id
A.duplicitVzdalenost = 78
B.duplicitOf = A.id
B.duplicitVzdalenost = 78
