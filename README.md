# CityUp — demo portálu obce (Obec Hvozdnice)

Prodejní demo digitálního portálu obce. Tři role — **občan**, **úředník**,
**starosta** — na jedné aplikaci. Vizuální jazyk dle [Design systému gov.cz](https://designsystem.gov.cz).

Vše běží v prohlížeči, bez backendu. Data jsou mock v paměti (po obnovení stránky
se demo vrátí do výchozího stavu).

---

## Spuštění

```bash
npm install
npm run dev      # vývojový server na http://localhost:5173
```

Produkční build:

```bash
npm run build    # výstup do dist/ (build proběhne bez chyb)
npm run preview  # lokální náhled produkčního buildu
```

## Nasazení na Vercel

Projekt je statická SPA (Vite). Na [vercel.com](https://vercel.com):

1. Import repozitáře.
2. Framework preset: **Vite** (detekuje se automaticky).
3. Build command `npm run build`, output directory `dist`.
4. Deploy.

Žádné proměnné prostředí ani backend nejsou potřeba. Routování je přes `#hash`,
takže funguje i bez konfigurace přepisů (rewrites).

---

## Mapa obrazovek (hash odkazy)

Role se přepínají lištou nahoře, nebo přímo přes hash.

### Občan
| Obrazovka | Hash |
|---|---|
| Úvod — dlaždice agend | `#obcan/uvod` |
| Přihlášení (Identita občana) — psi | `#obcan/prihlaseni` |
| Poplatek ze psů — formulář | `#obcan/psi` |
| Souhrn podání | `#obcan/souhrn` |
| Platba (QR / karta) | `#obcan/platba` |
| Stav podání (timeline) | `#obcan/stav` |
| Můj profil — historie, oznámení | `#obcan/profil` |
| Nahlásit podnět (mapa) | `#obcan/podnet` |
| Veřejná mapa podnětů | `#obcan/mapa` |
| Poplatek za odpad | `#obcan/odpad-prihlaseni` → `#obcan/odpad` |
| Obecné podání | `#obcan/podani-prihlaseni` → `#obcan/podani` |
| Rezervace na úřad | `#obcan/rezervace` |
| Nahlížení do spisu *(vize)* | `#obcan/spis` |
| Dotace obce *(vize)* | `#obcan/dotace` |

### Úředník
| Obrazovka | Hash |
|---|---|
| Fronta podání | `#urednik/fronta` |
| Detail podání + změna stavu | `#urednik/detail/CTU-2026-000122` |
| Kanban podnětů | `#urednik/podnety` |

### Starosta
| Obrazovka | Hash |
|---|---|
| Dashboard (KPI + grafy) | `#starosta/dashboard` |

---

## Co je mock (a co reálné)

**Reálné:**
- **QR platba** — generuje se validní řetězec SPD 1.0 (Short Payment Descriptor).
  QR kód lze naskenovat českou bankovní aplikací; předvyplní platbu (účet, částka,
  VS, zpráva). Viz `src/lib/spd.ts`.
- **Mapa** — MapLibre GL nad dlaždicemi OpenStreetMap, skutečné špendlíky a interakce.
- **Měření času** — banner „Vyřízeno za X" měří reálný čas od přihlášení po
  dokončení (od obr. 2 po obr. stavu).
- **Grafy** — Recharts nad mock daty.

**Mock:**
- Přihlášení „Identitou občana" — pevný profil Jan Novák (1985, TP Hvozdnice 123).
- Platba kartou, odeslání podání, doručenky — simulované prodlevy.
- Veškerá data (podání, podněty, KPI) jsou v paměti, bez perzistence.
- Fotografie u podnětů jsou náhledy / placeholdery.
- Obrazovky „Nahlížení do spisu" a „Dotace" jsou vizuální náhled budoucí fáze.

---

## Scénář schůzky (10 minut)

1. **Občan platí poplatek za psa (3 min).** `#obcan/uvod` → dlaždice *Psi* →
   přihlášení Identitou občana → formulář (jméno a adresa už ověřené, doplní se
   jen počet psů) → souhrn → **QR platba** (naskenovat reálnou bankovní aplikací) →
   stav s timeline a časem „Vyřízeno za X".
2. **Podnět na mapě (2 min).** Dlaždice *Podněty* → klik do mapy, kategorie, foto,
   e-mail → potvrzení s číslem. Ukázat veřejnou mapu `#obcan/mapa` s odpověďmi obce.
3. **Úředník — kanban (1 min).** Přepnout roli na **ÚŘEDNÍK** → `#urednik/podnety`,
   posunout podnět mezi stavy. Případně fronta podání a detail se změnou stavu.
4. **Starosta — dashboard (2 min).** Role **STAROSTA** → `#starosta/dashboard`:
   KPI (digitalizace, ušetřený čas, vybráno online) a grafy trendu.
5. **Vize (2 min).** Na úvodu sekce *Připravujeme* → *Nahlížení do spisu* a *Dotace* —
   kam portál míří v další fázi.

---

## Technologie

Vite · React · TypeScript · Tailwind CSS · MapLibre GL · Recharts · qrcode.

Design tokeny (barvy, typografie, mezery na 8pt gridu) jsou centralizované
v `tailwind.config.js` a `src/index.css`. Sdílené UI komponenty jsou v `src/ui/`
a používají se napříč všemi agendami.
