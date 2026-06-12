import { useMemo, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { GovMap, type MapMarker } from '../../ui/GovMap'
import { Card } from '../../ui/Card'
import { StatusBadge, STATUS_COLOR } from '../../ui/StatusBadge'
import { GovButton } from '../../ui/GovButton'
import { CameraIcon, ChatIcon, ArrowLeftIcon } from '../../ui/Icons'

export function PublicMap() {
  const { reports } = useApp()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const markers: MapMarker[] = useMemo(
    () =>
      reports.map((r) => ({
        id: r.id,
        lng: r.lng,
        lat: r.lat,
        color: STATUS_COLOR[r.status],
        onClick: () => setSelectedId(r.id),
      })),
    [reports],
  )

  const selected = reports.find((r) => r.id === selectedId)

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
      <h1 className="text-display text-ink">Veřejná mapa podnětů</h1>
      <p className="mt-2 text-body text-ink-soft">
        Co obyvatelé nahlásili a jak to obec řeší.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
        <GovMap markers={markers} className="h-[480px]" />

        <div className="flex flex-col gap-4">
          {/* Legend */}
          <Card className="flex flex-wrap gap-4">
            {(['novy', 'reseni', 'vyrizeno'] as const).map((s) => (
              <span key={s} className="inline-flex items-center">
                <StatusBadge status={s} />
              </span>
            ))}
          </Card>

          {selected ? (
            <Card className="gov-fade flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-label font-medium text-gov-blue">
                  {selected.category}
                </span>
                <StatusBadge status={selected.status} />
              </div>
              {selected.hasPhoto && (
                <div className="flex h-32 items-center justify-center rounded-btn bg-gov-blue-tint text-gov-blue">
                  <CameraIcon size={28} />
                </div>
              )}
              <p className="text-body text-ink">{selected.text}</p>
              <p className="tnum text-caption text-ink-soft">
                {selected.id} · {selected.createdAt}
              </p>
              {selected.response && (
                <div className="flex items-start gap-2 rounded-btn bg-gov-blue-tint px-4 py-2">
                  <span className="mt-[2px] text-gov-blue">
                    <ChatIcon size={18} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-caption font-medium text-ink-soft">
                      Odpověď obce
                    </span>
                    <span className="text-body text-ink">{selected.response}</span>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="text-body text-ink-soft">
              Vyberte špendlík na mapě pro detail podnětu.
            </Card>
          )}

          <GovButton onClick={() => navigate('obcan/podnet')} fullWidth>
            Nahlásit nový podnět
          </GovButton>
        </div>
      </div>
    </div>
  )
}
