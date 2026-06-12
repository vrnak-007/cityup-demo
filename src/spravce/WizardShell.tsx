import { useEffect, useState, type ReactNode } from 'react'
import { useTenant } from './tenant'
import { PortalPreview } from './PortalPreview'
import { formatElapsed } from '../lib/format'
import { CheckIcon, ClockIcon } from '../ui/Icons'

const TITULKY = [
  'Obec',
  'Adresa portálu',
  'Agendy',
  'Sazby z vyhlášky',
  'Platby',
  'Doručování podání',
  'Úředníci',
  'Texty a oznámení',
  'Kontrola připravenosti',
]

interface Props {
  // „K čemu to je" — jedna věta pod nadpisem kroku.
  hint: string
  children: ReactNode
  // Schová živý náhled (např. úvodní/success kroky bez portálu).
  hidePreview?: boolean
}

export function WizardShell({ hint, children, hidePreview }: Props) {
  const { krok, hotovo, totalKroku, goTo, startTimer, elapsedSec } = useTenant()
  const [, tick] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    startTimer()
  }, [startTimer])

  // Live ticking timer (a counter — allowed by the motion rules).
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      {/* Timer + step bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink">Nastavení portálu</h1>
        <span className="tnum inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-label text-ink-soft">
          <ClockIcon size={18} />
          Nastavujete {formatElapsed(elapsedSec())}
        </span>
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: totalKroku }, (_, i) => i + 1).map((n) => {
          const done = hotovo.includes(n)
          const active = n === krok
          return (
            <button
              key={n}
              onClick={() => goTo(n)}
              className="gov-focus flex shrink-0 items-center gap-2 rounded-full px-2 py-1"
            >
              <span
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-label font-semibold',
                  active
                    ? 'border-gov-blue bg-gov-blue text-white'
                    : done
                      ? 'border-success bg-success text-white'
                      : 'border-line bg-paper text-ink-soft',
                ].join(' ')}
              >
                {done && !active ? <CheckIcon size={16} /> : n}
              </span>
              <span
                className={`hidden text-caption md:inline ${
                  active ? 'font-medium text-ink' : 'text-ink-soft'
                }`}
              >
                {TITULKY[n - 1]}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,560px)_1fr]">
        {/* Config column */}
        <div>
          <h2 className="text-h2 text-ink">
            Krok {krok} · {TITULKY[krok - 1]}
          </h2>
          <p className="mt-2 text-body text-ink-soft">{hint}</p>
          <div className="mt-6 flex flex-col gap-6">{children}</div>
        </div>

        {/* Live preview */}
        {!hidePreview && (
          <div>
            {/* Mobile toggle */}
            <button
              onClick={() => setPreviewOpen((v) => !v)}
              className="gov-focus mb-4 w-full rounded-btn border border-line bg-paper px-4 py-2 text-label font-medium text-gov-blue lg:hidden"
            >
              {previewOpen ? 'Skrýt náhled' : 'Zobrazit náhled'}
            </button>
            <div
              className={`${previewOpen ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6`}
            >
              <PortalPreview />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
