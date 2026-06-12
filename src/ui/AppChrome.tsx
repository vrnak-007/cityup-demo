import type { ReactNode } from 'react'
import { useNavigate, useRoute } from '../lib/router'

const ROLES: { key: string; label: string; home: string }[] = [
  { key: 'obcan', label: 'OBČAN', home: 'obcan/uvod' },
  { key: 'urednik', label: 'ÚŘEDNÍK', home: 'urednik/fronta' },
  { key: 'starosta', label: 'STAROSTA', home: 'starosta/dashboard' },
]

// Demo-only role switcher (a discreet strip) + the municipal header.
export function AppChrome({ children }: { children: ReactNode }) {
  const { role } = useRoute()
  const navigate = useNavigate()

  const subtitle =
    role === 'urednik'
      ? 'Úřední pracoviště · CityUp'
      : role === 'starosta'
        ? 'Vedení obce · CityUp'
        : 'Portál občana · CityUp'

  // Clicking the logo returns to the current role's main screen.
  const home =
    role === 'urednik'
      ? 'urednik/fronta'
      : role === 'starosta'
        ? 'starosta/dashboard'
        : 'obcan/uvod'

  return (
    <div className="flex min-h-full flex-col">
      {/* Role switcher — present only because this is a demo. */}
      <div className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-app items-center gap-4 px-4 py-2">
          <span className="text-caption uppercase tracking-wide text-ink-soft">
            Demo · role
          </span>
          <nav className="flex items-center gap-1">
            {ROLES.map((r) => {
              const active = r.key === role
              return (
                <button
                  key={r.key}
                  onClick={() => navigate(r.home)}
                  className={[
                    'gov-focus rounded px-2 py-1 text-caption font-medium tracking-wide transition-colors',
                    active
                      ? 'bg-gov-blue-tint text-gov-blue'
                      : 'text-ink-soft hover:text-ink',
                  ].join(' ')}
                >
                  {r.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Municipal header. Logo + name returns to the role's main screen. */}
      <header className="bg-gov-blue-dark text-white">
        <div className="mx-auto flex max-w-app items-center px-4 py-4">
          <button
            type="button"
            onClick={() => navigate(home)}
            aria-label="Zpět na hlavní stránku"
            className="gov-focus flex items-center gap-4 rounded text-left transition-opacity hover:opacity-90"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/70 text-h2 font-bold">
              H
            </span>
            <span className="flex flex-col">
              <span className="text-h2 font-semibold leading-tight">
                Obec Hvozdnice
              </span>
              <span className="text-caption text-white/80">{subtitle}</span>
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-line bg-paper">
        <div className="mx-auto max-w-app px-4 py-6 text-center text-caption text-ink-soft">
          Obec Hvozdnice · Demo portálu CityUp · Design dle gov.cz
        </div>
      </footer>
    </div>
  )
}
