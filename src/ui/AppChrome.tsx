import { useState, type ReactNode } from 'react'
import { useNavigate, useRoute } from '../lib/router'
import { useApp } from '../lib/store'
import { useTenant } from '../spravce/tenant'
import { BellIcon } from './Icons'

const ROLES: { key: string; label: string; home: string }[] = [
  { key: 'obcan', label: 'OBČAN', home: 'obcan/uvod' },
  { key: 'urednik', label: 'ÚŘEDNÍK', home: 'urednik/fronta' },
  { key: 'starosta', label: 'STAROSTA', home: 'starosta/dashboard' },
  { key: 'spravce', label: 'SPRÁVCE', home: 'spravce/pruvodce' },
]

// Demo-only role switcher (a discreet strip) + the municipal header.
export function AppChrome({ children }: { children: ReactNode }) {
  const { role } = useRoute()
  const navigate = useNavigate()
  const { notifikace } = useApp()
  const { cfg } = useTenant()
  const [bellOpen, setBellOpen] = useState(false)
  const showBell = role === 'urednik' || role === 'starosta'

  const spravceHome = cfg.spusteno ? 'spravce/sprava' : 'spravce/pruvodce'

  const subtitle =
    role === 'urednik'
      ? 'Úřední pracoviště · CityUp'
      : role === 'starosta'
        ? 'Vedení obce · CityUp'
        : role === 'spravce'
          ? 'Nastavení obce · CityUp'
          : 'Portál občana · CityUp'

  // Clicking the logo returns to the current role's main screen.
  const home =
    role === 'urednik'
      ? 'urednik/fronta'
      : role === 'starosta'
        ? 'starosta/dashboard'
        : role === 'spravce'
          ? spravceHome
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
                  onClick={() =>
                    navigate(r.key === 'spravce' ? spravceHome : r.home)
                  }
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
        <div className="mx-auto flex max-w-app items-center justify-between px-4 py-4">
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

          {showBell && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setBellOpen((v) => !v)}
                aria-label={`Oznámení (${notifikace.length})`}
                className="gov-focus relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
              >
                <BellIcon size={24} />
                {notifikace.length > 0 && (
                  <span
                    className="tnum absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[11px] font-bold text-white"
                    style={{ backgroundColor: 'var(--error)' }}
                  >
                    {notifikace.length}
                  </span>
                )}
              </button>
              {bellOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setBellOpen(false)}
                  />
                  <div className="gov-fade absolute right-0 z-40 mt-2 w-80 overflow-hidden rounded-card border border-line bg-paper text-ink shadow-card">
                    <div className="border-b border-line px-4 py-2 text-label font-medium text-ink-soft">
                      Oznámení
                    </div>
                    <ul>
                      {notifikace.map((n) => (
                        <li
                          key={n.id}
                          className="flex flex-col gap-1 border-b border-line px-4 py-2 last:border-0"
                        >
                          <span className="text-body text-ink">{n.text}</span>
                          <span className="text-caption text-ink-soft">{n.kdy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}
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
