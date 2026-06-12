import type { ReactNode } from 'react'
import { useTenant, AGENDA_META, type AgendaKey } from './tenant'
import { Tile } from '../ui/Tile'
import {
  DogIcon,
  TrashIcon,
  DocumentIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
} from '../ui/Icons'

const ICON: Record<AgendaKey, ReactNode> = {
  psi: <DogIcon size={24} />,
  odpad: <TrashIcon size={24} />,
  obecne: <DocumentIcon size={24} />,
  podnety: <MapPinIcon size={24} />,
  rezervace: <CalendarIcon size={24} />,
}

// Live preview of the citizen portal, reusing the real demo components.
// Every config change is reflected here immediately.
export function PortalPreview() {
  const { cfg } = useTenant()
  const enabled = AGENDA_META.filter((a) => cfg.agendy[a.key])
  const nazev = cfg.nazev || 'Název obce'

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-2 text-caption font-medium text-ink-soft">
        <span className="h-2 w-2 rounded-full" style={{ background: 'var(--success)' }} />
        Živý náhled portálu občana
      </span>

      {/* Phone frame */}
      <div className="w-[300px] overflow-hidden rounded-[2rem] border-8 border-ink bg-canvas shadow-card">
        <div className="h-[560px] overflow-y-auto">
          {/* Header */}
          <div className="bg-gov-blue-dark px-4 py-4 text-white">
            <div className="flex items-center gap-2">
              {cfg.znak ? (
                <img
                  src={cfg.znak}
                  alt=""
                  className="h-10 w-10 rounded-full border-2 border-white/70 object-cover"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/70 text-body font-bold">
                  {nazev.replace(/^Obec\s+/i, '').charAt(0).toUpperCase() || 'H'}
                </span>
              )}
              <div className="flex flex-col">
                <span className="text-body font-semibold leading-tight">{nazev}</span>
                <span className="text-[11px] text-white/80">Portál občana · CityUp</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-4 py-4">
            <h2 className="text-h2 font-bold text-ink">Vyřiďte to z domova</h2>
            <p className="mt-2 text-caption text-ink-soft">{cfg.uvitaci}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {enabled.map((a) => (
                <Tile
                  key={a.key}
                  icon={ICON[a.key]}
                  title={a.nazev}
                  description={a.popis}
                  onClick={() => undefined}
                />
              ))}
              <Tile
                icon={<UserIcon size={24} />}
                title="Můj profil"
                description="Historie podání"
                onClick={() => undefined}
              />
            </div>

            {enabled.length === 0 && (
              <p className="mt-4 text-caption text-warning">
                Zapněte alespoň jednu agendu v kroku 3.
              </p>
            )}
          </div>
        </div>
      </div>
      <span className="text-caption text-ink-soft">
        {cfg.subdomena || 'obec'}.cityup.cz
      </span>
    </div>
  )
}
