import { useMemo } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { GovMap, type MapMarker } from '../../ui/GovMap'
import { StatusBadge, STATUS_COLOR } from '../../ui/StatusBadge'
import { ArrowLeftIcon } from '../../ui/Icons'
import { PODNETY_VYRESENO_ROK } from '../../data/dashboard'

export function Transparency() {
  const { podani, reports } = useApp()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const vyrizene = podani.filter((p) => p.stav === 'vyrizeno')
    const prum = vyrizene.length
      ? vyrizene.reduce((s, p) => s + (p.dobaVyrizeniDni ?? 0), 0) /
        vyrizene.length
      : 0
    const doLhuty = vyrizene.filter((p) => (p.dobaVyrizeniDni ?? 0) <= 5).length
    const slaPct = vyrizene.length
      ? Math.round((doLhuty / vyrizene.length) * 100)
      : 0
    return { prum, slaPct }
  }, [podani])

  const markers: MapMarker[] = reports.map((r) => ({
    id: r.id,
    lng: r.lng,
    lat: r.lat,
    color: STATUS_COLOR[r.status],
  }))

  const KPI = [
    { v: stats.prum.toFixed(1).replace('.', ','), u: 'dne', l: 'průměrná doba vyřízení' },
    { v: `${stats.slaPct} %`, u: '', l: 'vyřízeno do 5 dnů' },
    { v: String(PODNETY_VYRESENO_ROK), u: '', l: 'vyřešených podnětů v roce 2026' },
  ]

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <button
        type="button"
        onClick={() => navigate('obcan/uvod')}
        className="gov-focus mb-4 inline-flex items-center gap-2 rounded text-label font-medium text-gov-blue hover:underline"
      >
        <ArrowLeftIcon size={18} />
        Zpět
      </button>
      <h1 className="text-display text-ink">Jak nám to jde</h1>
      <p className="mt-2 text-body text-ink-soft">
        Výkon úřadu obce Hvozdnice — veřejně a průběžně.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {KPI.map((k) => (
          <Card key={k.l} className="flex flex-col gap-2">
            <span className="tnum text-display text-ink">
              {k.v}
              {k.u && <span className="text-h2 text-ink-soft"> {k.u}</span>}
            </span>
            <span className="text-label font-medium text-ink">{k.l}</span>
          </Card>
        ))}
      </div>

      <h2 className="mt-8 text-h2 text-ink">Podněty na mapě</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
        <GovMap markers={markers} className="h-[420px]" />
        <Card className="flex flex-col gap-4">
          {(['novy', 'reseni', 'vyrizeno'] as const).map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
          <GovButton onClick={() => navigate('obcan/mapa')} className="mt-2">
            Otevřít veřejnou mapu
          </GovButton>
        </Card>
      </div>

      <p className="mt-6 text-caption text-ink-soft">
        Obec Hvozdnice zveřejňuje výkon úřadu dobrovolně.
      </p>
    </div>
  )
}
