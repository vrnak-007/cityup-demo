import type { Report, Submission, User } from './types'

// The citizen identity returned by the mocked „Identita občana" login.
export const MOCK_USER: User = {
  name: 'Jan Novák',
  born: 1985,
  address: 'Hvozdnice 123, 252 05',
}

// Officer queue — pre-seeded so the demo opens on a populated table.
// The first entry is Jan Novák's own history so his profile is never empty.
export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'CTU-2025-000914',
    kind: 'odpad',
    title: 'Poplatek za odpad 2025',
    citizen: 'Jan Novák',
    amount: 600,
    status: 'vyrizeno',
    createdAt: '14. 1. 2025',
    paid: true,
    detail: [
      { label: 'Poplatník', value: 'Jan Novák' },
      { label: 'Nemovitost', value: 'Hvozdnice 123, 252 05' },
      { label: 'Počet osob', value: '1' },
    ],
    officerNote: 'Uhrazeno, poplatek vyřízen.',
  },
  {
    id: 'CTU-2026-000118',
    kind: 'pes',
    title: 'Poplatek ze psů 2026',
    citizen: 'Marie Dvořáková',
    amount: 200,
    status: 'vyrizeno',
    createdAt: '2. 6. 2026',
    paid: true,
    detail: [
      { label: 'Poplatník', value: 'Marie Dvořáková' },
      { label: 'Adresa', value: 'Hvozdnice 88, 252 05' },
      { label: 'Počet psů', value: '1' },
      { label: 'Úleva 65+', value: 'Ne' },
      { label: 'Číslo čipu', value: '203094100120345' },
    ],
    officerNote: 'Platba spárována, poplatek vyřízen.',
  },
  {
    id: 'CTU-2026-000120',
    kind: 'odpad',
    title: 'Poplatek za odpad 2026',
    citizen: 'Petr Svoboda',
    amount: 1800,
    status: 'reseni',
    createdAt: '5. 6. 2026',
    paid: true,
    detail: [
      { label: 'Poplatník', value: 'Petr Svoboda' },
      { label: 'Nemovitost', value: 'Hvozdnice 47, 252 05' },
      { label: 'Počet osob', value: '3' },
    ],
  },
  {
    id: 'CTU-2026-000121',
    kind: 'obecne',
    title: 'Žádost o kácení dřeviny',
    citizen: 'Eva Horáková',
    amount: 0,
    status: 'novy',
    createdAt: '9. 6. 2026',
    paid: true,
    detail: [
      { label: 'Podatel', value: 'Eva Horáková' },
      { label: 'Odbor', value: 'Životní prostředí' },
      {
        label: 'Předmět',
        value: 'Žádost o povolení kácení vzrostlé břízy na pozemku p. č. 412/3.',
      },
    ],
  },
  {
    id: 'CTU-2026-000122',
    kind: 'pes',
    title: 'Poplatek ze psů 2026',
    citizen: 'Tomáš Král',
    amount: 100,
    status: 'novy',
    createdAt: '11. 6. 2026',
    paid: false,
    detail: [
      { label: 'Poplatník', value: 'Tomáš Král' },
      { label: 'Adresa', value: 'Hvozdnice 12, 252 05' },
      { label: 'Počet psů', value: '1' },
      { label: 'Úleva 65+', value: 'Ano' },
      { label: 'Číslo čipu', value: '—' },
    ],
  },
]

// Six reports backing the public map and the officer kanban.
// Centred around 49.93 N, 14.42 E (Hvozdnice).
export const SEED_REPORTS: Report[] = [
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
  },
]

// Dashboard KPI line: 12 months of submissions, digital vs. paper.
export const SUBMISSIONS_PER_MONTH = [
  { month: 'Čvc', digital: 42, papir: 70 },
  { month: 'Srp', digital: 51, papir: 64 },
  { month: 'Zář', digital: 63, papir: 58 },
  { month: 'Říj', digital: 78, papir: 52 },
  { month: 'Lis', digital: 86, papir: 47 },
  { month: 'Pro', digital: 94, papir: 44 },
  { month: 'Led', digital: 121, papir: 41 },
  { month: 'Úno', digital: 118, papir: 38 },
  { month: 'Bře', digital: 142, papir: 35 },
  { month: 'Dub', digital: 156, papir: 33 },
  { month: 'Kvě', digital: 168, papir: 30 },
  { month: 'Čvn', digital: 174, papir: 28 },
]

// Online fees collected per month (Kč), for the bar chart.
export const FEES_PER_MONTH = [
  { month: 'Led', kc: 38200 },
  { month: 'Úno', kc: 31400 },
  { month: 'Bře', kc: 44600 },
  { month: 'Dub', kc: 52800 },
  { month: 'Kvě', kc: 61200 },
  { month: 'Čvn', kc: 47400 },
]

// Top agendas by volume, for the donut (shades of blue).
export const TOP_AGENDAS = [
  { name: 'Odpad', value: 38 },
  { name: 'Psi', value: 24 },
  { name: 'Obecné podání', value: 18 },
  { name: 'Podněty', value: 12 },
  { name: 'Rezervace', value: 8 },
]
