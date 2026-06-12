// Mini-trend datasets for the mayor dashboard (Addon 2 P2).

// Plnění 5denní lhůty za posledních 6 měsíců (%).
export const SLA_TREND: { month: string; pct: number }[] = [
  { month: 'Led', pct: 79 },
  { month: 'Úno', pct: 82 },
  { month: 'Bře', pct: 84 },
  { month: 'Dub', pct: 85 },
  { month: 'Kvě', pct: 86 },
  { month: 'Čvn', pct: 88 },
]

// Kumulativní počet vyřešených podnětů za rok (veřejná transparentnost).
export const PODNETY_VYRESENO_ROK = 41

// Top opakované/řešené problémy pro report zastupitelstvu.
export const TOP_PROBLEMY: { nazev: string; pocet: number; odbor: string }[] = [
  { nazev: 'Výtluky a stav vozovek', pocet: 9, odbor: 'Doprava' },
  { nazev: 'Veřejné osvětlení', pocet: 6, odbor: 'Správa majetku' },
  { nazev: 'Černé skládky a odpad', pocet: 4, odbor: 'Životní prostředí' },
  { nazev: 'Zeleň a chodníky', pocet: 3, odbor: 'Podatelna' },
]
