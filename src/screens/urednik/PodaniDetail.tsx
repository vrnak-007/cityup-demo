import { useMemo, useState } from 'react'
import { useNavigate, useRoute } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { GovTextarea } from '../../ui/GovInput'
import { DefinitionList } from '../../ui/DefinitionList'
import { PodaniStavBadge } from '../../ui/PodaniStavBadge'
import { ArrowLeftIcon, CheckIcon, DocumentIcon } from '../../ui/Icons'
import { SABLONY_VRACENI } from '../../data/officer'
import { slaLabel } from '../../data/sla'

export function PodaniDetail() {
  const { param } = useRoute()
  const { podani, prevzitPodani, schvalitVyridit, vratitKDoplneni } = useApp()
  const navigate = useNavigate()
  const p = podani.find((x) => x.id === param)

  const [vracetMode, setVracetMode] = useState(false)
  const [sablonaId, setSablonaId] = useState<string | null>(null)
  const [zprava, setZprava] = useState('')
  const [done, setDone] = useState<'vyrizeno' | 'vraceno' | null>(null)

  const detailRows = useMemo(() => {
    if (!p) return []
    return p.detail.map((d) =>
      d.label === 'Částka'
        ? { label: 'Částka', value: formatKc(Number(d.value)) }
        : d,
    )
  }, [p])

  if (!p) {
    return (
      <div className="mx-auto w-full max-w-app px-4 py-12">
        <p className="text-body text-ink-soft">Podání nenalezeno.</p>
        <GovButton variant="plain" onClick={() => navigate('urednik/fronta')}>
          Zpět na frontu
        </GovButton>
      </div>
    )
  }

  const sla = slaLabel(p.podanoDni)
  const otevreno = p.stav !== 'vyrizeno' && p.stav !== 'vraceno'

  const odeslatVraceni = () => {
    if (zprava.trim().length < 5) return
    vratitKDoplneni(p.id, zprava.trim())
    setDone('vraceno')
    setVracetMode(false)
  }

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <button
        type="button"
        onClick={() => navigate('urednik/fronta')}
        className="gov-focus mb-4 inline-flex items-center gap-2 rounded text-label font-medium text-gov-blue hover:underline"
      >
        <ArrowLeftIcon size={18} />
        Zpět na frontu
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-display text-ink">{p.agenda}</h1>
        <PodaniStavBadge stav={done ?? p.stav} />
      </div>
      <p className="tnum mt-2 text-body text-ink-soft">
        {p.id} · podáno {p.podano_at} · {p.odbor}
        {otevreno && (
          <span className={sla.level === 'over' ? 'text-error' : ''}>
            {' · '}
            {sla.text}
          </span>
        )}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
        {/* Document + history */}
        <div className="flex flex-col gap-6">
          <Card className="!p-0">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-label text-ink-soft">
              <DocumentIcon size={18} />
              podani-{p.id}.pdf
            </div>
            <div className="p-4">
              <DefinitionList items={detailRows} />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-h2 text-ink">Historie</h2>
            <ol className="flex flex-col gap-4">
              {p.historie.map((k, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-1 flex flex-col items-center">
                    <span className="h-3 w-3 rounded-full bg-gov-blue" />
                    {i < p.historie.length - 1 && (
                      <span className="mt-1 w-[2px] flex-1 bg-line" style={{ minHeight: 24 }} />
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-body font-medium text-ink">{k.stav}</span>
                    <span className="tnum text-caption text-ink-soft">
                      {k.kdy} · {k.kdo}
                      {k.dobaKroku ? ` · ${k.dobaKroku}` : ''}
                    </span>
                    {k.komentar && (
                      <span className="text-caption text-ink">{k.komentar}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          {p.resitel === null && (
            <Card className="flex flex-col gap-2">
              <span className="text-body text-ink">Podání zatím nikdo nepřevzal.</span>
              <GovButton onClick={() => prevzitPodani(p.id)} fullWidth>
                Převzít k vyřízení
              </GovButton>
            </Card>
          )}

          {done === 'vyrizeno' && (
            <Card className="flex items-center gap-2">
              <span className="text-success">
                <CheckIcon />
              </span>
              <span className="text-body text-ink">Podání vyřízeno.</span>
            </Card>
          )}
          {done === 'vraceno' && (
            <Card className="flex items-center gap-2">
              <span className="text-warning">
                <CheckIcon />
              </span>
              <span className="text-body text-ink">
                Vráceno občanovi, odeslána notifikace.
              </span>
            </Card>
          )}

          {!done && p.resitel !== null && (
            <Card className="flex flex-col gap-4">
              <span className="text-h2 text-ink">Akce</span>
              {!vracetMode ? (
                <div className="flex flex-col gap-2">
                  <GovButton onClick={() => { schvalitVyridit(p.id); setDone('vyrizeno') }} fullWidth>
                    Schválit a vyřídit
                  </GovButton>
                  <GovButton
                    variant="secondary"
                    onClick={() => setVracetMode(true)}
                    fullWidth
                  >
                    Vrátit k doplnění
                  </GovButton>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <span className="text-label font-medium text-ink">
                    Šablona zprávy občanovi
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SABLONY_VRACENI.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSablonaId(s.id)
                          setZprava(s.text)
                        }}
                        className={[
                          'gov-focus rounded-full border px-4 py-2 text-label font-medium transition-colors',
                          sablonaId === s.id
                            ? 'border-gov-blue bg-gov-blue text-white'
                            : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
                        ].join(' ')}
                      >
                        {s.nazev}
                      </button>
                    ))}
                  </div>
                  <GovTextarea
                    label="Text zprávy (lze upravit)"
                    value={zprava}
                    onChange={(e) => setZprava(e.target.value)}
                    placeholder="Vyberte šablonu nebo napište zprávu…"
                  />
                  <div className="flex gap-2">
                    <GovButton
                      onClick={odeslatVraceni}
                      disabled={zprava.trim().length < 5}
                    >
                      Odeslat občanovi
                    </GovButton>
                    <GovButton variant="plain" onClick={() => setVracetMode(false)}>
                      Zrušit
                    </GovButton>
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card tint className="flex flex-col gap-2">
            <span className="text-caption font-medium text-ink-soft">Řešitel</span>
            <span className="text-body text-ink">{p.resitel ?? 'Nepřevzato'}</span>
            <span className="text-caption text-ink-soft">
              Automaticky přiřazeno odboru: {p.odbor}
            </span>
          </Card>
        </div>
      </div>
    </div>
  )
}
