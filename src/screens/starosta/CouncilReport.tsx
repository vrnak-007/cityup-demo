import { GovButton } from '../../ui/GovButton'
import { StarRating } from '../../ui/StarRating'
import { formatKc, formatNumber } from '../../lib/format'
import { TOP_PROBLEMY } from '../../data/dashboard'

interface Props {
  onClose: () => void
  metrics: {
    podaniCelkem: number
    digitalPct: number
    slaPct: number
    spokojenost: number
    predpis: number
    vybrano: number
    vybranoPct: number
    dluzi: number
    podnetyVyreseno: number
  }
}

// Mock A4 náhled měsíčního reportu pro zastupitelstvo.
export function CouncilReport({ onClose, metrics }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto p-4"
      style={{ background: 'rgba(38,38,38,0.45)' }}
      onClick={onClose}
    >
      <div className="mx-auto flex max-w-[800px] flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-label font-medium text-white">
            Náhled reportu
          </span>
          <div className="flex gap-2">
            <GovButton
              onClick={(e) => {
                e.stopPropagation()
                window.alert('Mock: report by se stáhl jako PDF.')
              }}
            >
              Stáhnout PDF
            </GovButton>
            <GovButton variant="secondary" onClick={onClose} className="!bg-paper">
              Zavřít
            </GovButton>
          </div>
        </div>

        {/* A4 stránka */}
        <article
          className="gov-fade mb-8 bg-paper p-8 shadow-card"
          style={{ aspectRatio: '210 / 297' }}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="flex items-center justify-between border-b border-line pb-4">
            <div>
              <h2 className="text-h2 font-semibold text-ink">Obec Hvozdnice</h2>
              <p className="text-caption text-ink-soft">
                Měsíční report výkonu úřadu · červen 2026
              </p>
            </div>
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gov-blue-dark text-h2 font-bold text-gov-blue-dark">
              H
            </span>
          </header>

          <section className="mt-6 grid grid-cols-2 gap-4">
            {[
              { v: formatNumber(metrics.podaniCelkem), l: 'podání celkem' },
              { v: `${metrics.digitalPct} %`, l: 'digitálně' },
              { v: `${metrics.slaPct} %`, l: 'do lhůty 5 dnů' },
              { v: metrics.spokojenost.toFixed(1).replace('.', ','), l: 'spokojenost (z 5)' },
            ].map((k) => (
              <div key={k.l} className="rounded-card border border-line p-4">
                <div className="tnum text-display text-ink">{k.v}</div>
                <div className="text-label text-ink-soft">{k.l}</div>
              </div>
            ))}
          </section>

          <section className="mt-6">
            <h3 className="text-label font-medium text-ink-soft">Výběr poplatků 2026</h3>
            <p className="tnum mt-2 text-body text-ink">
              Vybráno {formatKc(metrics.vybrano)} z {formatKc(metrics.predpis)} (
              {metrics.vybranoPct} %). Dluží {metrics.dluzi} poplatníků.
            </p>
          </section>

          <section className="mt-6">
            <h3 className="text-label font-medium text-ink-soft">
              Nejčastější problémy v obci
            </h3>
            <ul className="mt-2 flex flex-col">
              {TOP_PROBLEMY.map((p, i) => (
                <li
                  key={p.nazev}
                  className={`flex items-center justify-between py-2 ${
                    i > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <span className="text-body text-ink">{p.nazev}</span>
                  <span className="tnum text-label text-ink-soft">
                    {p.pocet}× · {p.odbor}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <div>
              <h3 className="text-label font-medium text-ink-soft">
                Spokojenost občanů
              </h3>
              <p className="tnum text-body text-ink">
                {metrics.spokojenost.toFixed(1).replace('.', ',')} / 5 ·{' '}
                {metrics.podnetyVyreseno} vyřešených podnětů
              </p>
            </div>
            <StarRating value={Math.round(metrics.spokojenost)} readOnly size={22} />
          </section>

          <footer className="mt-8 border-t border-line pt-4 text-caption text-ink-soft">
            Vygenerováno portálem CityUp · data dle stavu k 12. 6. 2026
          </footer>
        </article>
      </div>
    </div>
  )
}
