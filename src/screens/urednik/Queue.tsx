import { useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { OfficerNav } from '../../ui/OfficerNav'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { PodaniStavBadge } from '../../ui/PodaniStavBadge'
import { CalendarIcon } from '../../ui/Icons'
import { slaLabel } from '../../data/sla'
import type { Podani, Resitel } from '../../data/types'

type Filter = 'vse' | 'moje' | 'neprevzato'

function SlaCell({ p }: { p: Podani }) {
  if (p.stav === 'vyrizeno') {
    return (
      <span className="tnum text-caption text-success">
        vyřízeno za {p.dobaVyrizeniDni} dní
      </span>
    )
  }
  if (p.stav === 'vraceno') {
    return <span className="text-caption text-ink-soft">čeká na občana</span>
  }
  const sla = slaLabel(p.podanoDni)
  return (
    <span
      className={`tnum text-caption font-medium ${
        sla.level === 'over' ? 'text-error' : 'text-ink-soft'
      }`}
    >
      {sla.text}
    </span>
  )
}

export function Queue() {
  const {
    podani,
    currentOfficer,
    rezervaceDnes,
    prevzitPodani,
    predatPodani,
  } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('vse')

  const filtered = podani.filter((p) => {
    if (filter === 'moje') return p.resitel === currentOfficer
    if (filter === 'neprevzato') return p.resitel === null
    return true
  })

  const counts = {
    vse: podani.length,
    moje: podani.filter((p) => p.resitel === currentOfficer).length,
    neprevzato: podani.filter((p) => p.resitel === null).length,
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'vse', label: `Vše (${counts.vse})` },
    { key: 'moje', label: `Moje (${counts.moje})` },
    { key: 'neprevzato', label: `Nepřevzato (${counts.neprevzato})` },
  ]

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <OfficerNav />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display text-ink">Moje fronta</h1>
          <p className="mt-2 text-body text-ink-soft">
            Přihlášen: úředník {currentOfficer}
          </p>
        </div>
      </div>

      {/* Today's reservations (P3.12). */}
      <Card className="mt-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-gov-blue">
            <CalendarIcon />
          </span>
          <span className="text-h2 text-ink">
            Dnes objednáno {rezervaceDnes.length} občanů
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {rezervaceDnes.map((r) => (
            <span
              key={r.cas + r.obcan}
              className="inline-flex items-center gap-2 rounded-btn border border-line bg-canvas px-4 py-2 text-label"
            >
              <span className="tnum font-medium text-ink">{r.cas}</span>
              <span className="text-ink-soft">
                {r.agenda} · {r.obcan}
              </span>
            </span>
          ))}
        </div>
      </Card>

      {/* Filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={[
              'gov-focus rounded-full border px-4 py-2 text-label font-medium transition-colors',
              filter === f.key
                ? 'border-gov-blue bg-gov-blue text-white'
                : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-label text-ink-soft">
              <th className="px-4 py-2 font-medium">Číslo</th>
              <th className="px-4 py-2 font-medium">Agenda</th>
              <th className="px-4 py-2 font-medium">Žadatel</th>
              <th className="px-4 py-2 font-medium">Řešitel</th>
              <th className="px-4 py-2 font-medium">Lhůta</th>
              <th className="px-4 py-2 font-medium">Stav</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr
                key={p.id}
                className={`border-b border-line last:border-0 ${
                  i % 2 === 1 ? 'bg-canvas' : 'bg-paper'
                }`}
              >
                <td className="tnum px-4 py-2 text-label text-ink">{p.id}</td>
                <td className="px-4 py-2 text-body text-ink">{p.agenda}</td>
                <td className="px-4 py-2 text-body text-ink">{p.zadatel}</td>
                <td className="px-4 py-2 text-body text-ink-soft">
                  {p.resitel ?? '—'}
                </td>
                <td className="px-4 py-2">
                  <SlaCell p={p} />
                </td>
                <td className="px-4 py-2">
                  <PodaniStavBadge stav={p.stav} />
                </td>
                <td className="px-4 py-2">
                  <RowActions
                    p={p}
                    mine={p.resitel === currentOfficer}
                    onPrevzit={() => prevzitPodani(p.id)}
                    onPredat={(r) => predatPodani(p.id, r)}
                    onDetail={() => navigate(`urednik/podani/${p.id}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RowActions({
  p,
  mine,
  onPrevzit,
  onPredat,
  onDetail,
}: {
  p: Podani
  mine: boolean
  onPrevzit: () => void
  onPredat: (r: Resitel) => void
  onDetail: () => void
}) {
  const KOLEGOVE: Exclude<Resitel, null>[] = ['Nováková', 'Svoboda', 'Dvořáková']
  return (
    <div className="flex items-center justify-end gap-2 whitespace-nowrap">
      {p.resitel === null ? (
        <GovButton onClick={onPrevzit} className="!h-10 !px-2">
          Převzít
        </GovButton>
      ) : mine && p.stav !== 'vyrizeno' ? (
        <select
          aria-label="Předat kolegovi"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) onPredat(e.target.value as Resitel)
          }}
          className="gov-focus h-10 rounded-btn border border-line bg-paper px-2 text-label text-ink"
        >
          <option value="" disabled>
            Předat…
          </option>
          {KOLEGOVE.filter((k) => k !== p.resitel).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      ) : null}
      <button
        onClick={onDetail}
        className="gov-focus rounded px-2 py-1 text-label font-medium text-gov-blue hover:underline"
      >
        Detail
      </button>
    </div>
  )
}
