import { useState } from 'react'
import { useTenant, AGENDA_META } from './tenant'
import { useNavigate } from '../lib/router'
import { Card } from '../ui/Card'
import { GovButton } from '../ui/GovButton'
import { InfoBar } from '../ui/InfoBar'
import { CheckIcon } from '../ui/Icons'
import { formatKc } from '../lib/format'

function StatusRadek({ ok, label }: { ok: boolean | null; label: string }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="text-body text-ink">{label}</span>
      {ok === null ? (
        <span className="text-caption text-ink-soft">připravujeme</span>
      ) : ok ? (
        <span className="inline-flex items-center gap-1 text-caption text-success">
          <CheckIcon size={14} /> aktivní
        </span>
      ) : (
        <span className="text-caption text-ink-soft">—</span>
      )}
    </div>
  )
}

export function Admin() {
  const { cfg, goTo } = useTenant()
  const navigate = useNavigate()
  const [sazby2027, setSazby2027] = useState(false)

  const edit = (krok: number) => {
    goTo(krok)
    navigate('spravce/pruvodce')
  }

  const aktivniAgendy = AGENDA_META.filter((a) => cfg.agendy[a.key])

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-ink">Správa obce</h1>
          <p className="mt-2 text-body text-ink-soft">
            Portál {cfg.nazev || 'Obec Hvozdnice'} · {cfg.subdomena || 'obec'}
            .cityup.cz
          </p>
        </div>
        <GovButton variant="secondary" onClick={() => navigate('obcan/uvod')}>
          Zobrazit portál očima občana
        </GovButton>
      </div>

      <div className="mt-6">
        <InfoBar>
          Změny sazeb se projeví okamžitě; historie verzí zůstává zachována pro
          podání z minulosti.
        </InfoBar>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Napojení */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-ink">Napojení</h2>
            <button onClick={() => edit(6)} className="gov-focus rounded text-label font-medium text-gov-blue hover:underline">
              Upravit
            </button>
          </div>
          <div className="flex flex-col">
            <StatusRadek ok={cfg.isdsTested} label="Datová schránka (ISDS)" />
            <StatusRadek ok={null} label="Spisová služba" />
            <StatusRadek ok={cfg.ucet.trim().length > 0} label="Platby (QR)" />
          </div>
        </Card>

        {/* Agendy */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-ink">Agendy</h2>
            <button onClick={() => edit(3)} className="gov-focus rounded text-label font-medium text-gov-blue hover:underline">
              Upravit
            </button>
          </div>
          <span className="tnum text-display text-ink">{aktivniAgendy.length} aktivních</span>
          <div className="flex flex-wrap gap-2">
            {aktivniAgendy.map((a) => (
              <span key={a.key} className="rounded-full bg-gov-blue-tint px-4 py-1 text-caption font-medium text-gov-blue">
                {a.nazev}
              </span>
            ))}
          </div>
        </Card>

        {/* Uživatelé */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-ink">Uživatelé</h2>
            <button onClick={() => edit(7)} className="gov-focus rounded text-label font-medium text-gov-blue hover:underline">
              Upravit
            </button>
          </div>
          <span className="tnum text-display text-ink">{cfg.pozvanky.length}</span>
          <div className="flex flex-col gap-2">
            {cfg.pozvanky.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-caption">
                <span className="text-ink">{p.email}</span>
                <span className="text-ink-soft">{p.role} · poslední přihlášení dnes 7:14</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Sazby 2026 */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-h2 text-ink">Sazby 2026</h2>
            <button onClick={() => edit(4)} className="gov-focus rounded text-label font-medium text-gov-blue hover:underline">
              Upravit
            </button>
          </div>
          <dl className="tnum flex flex-col gap-2 text-label">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Pes — první</dt>
              <dd className="text-ink">{formatKc(cfg.pesPrvni)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Pes — další</dt>
              <dd className="text-ink">{formatKc(cfg.pesDalsi)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-soft">Odpad — osoba</dt>
              <dd className="text-ink">{formatKc(cfg.odpadOsoba)}</dd>
            </div>
          </dl>
          <span className="text-caption text-ink-soft">Platná verze: 2026</span>
          {sazby2027 ? (
            <span className="inline-flex items-center gap-2 text-caption text-success">
              <CheckIcon size={16} /> Vytvořena kopie sazeb 2027 k úpravě.
            </span>
          ) : (
            <GovButton variant="secondary" onClick={() => setSazby2027(true)} className="self-start">
              Připravit sazby 2027
            </GovButton>
          )}
        </Card>
      </div>
    </div>
  )
}
