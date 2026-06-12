import { useState } from 'react'
import { useNavigate, useRoute } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { GovTextarea } from '../../ui/GovInput'
import { DefinitionList } from '../../ui/DefinitionList'
import { StatusBadge } from '../../ui/StatusBadge'
import { DocumentIcon, ArrowLeftIcon } from '../../ui/Icons'
import type { SubmissionStatus } from '../../lib/types'

const NEXT: { value: SubmissionStatus; label: string }[] = [
  { value: 'novy', label: 'Nový' },
  { value: 'reseni', label: 'V řešení' },
  { value: 'vyrizeno', label: 'Vyřešeno' },
]

export function SubmissionDetail() {
  const { param } = useRoute()
  const { submissions, updateSubmissionStatus } = useApp()
  const navigate = useNavigate()
  const sub = submissions.find((s) => s.id === param)

  const [status, setStatus] = useState<SubmissionStatus>(sub?.status ?? 'novy')
  const [comment, setComment] = useState('')
  const [touched, setTouched] = useState(false)
  const [saved, setSaved] = useState(false)

  if (!sub) {
    return (
      <div className="mx-auto w-full max-w-app px-4 py-12">
        <p className="text-body text-ink-soft">Podání nenalezeno.</p>
        <GovButton variant="plain" onClick={() => navigate('urednik/fronta')}>
          Zpět na frontu
        </GovButton>
      </div>
    )
  }

  const save = () => {
    setTouched(true)
    if (comment.trim().length < 3) return
    updateSubmissionStatus(sub.id, status, comment.trim())
    setSaved(true)
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

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-display text-ink">{sub.title}</h1>
        <StatusBadge status={saved ? status : sub.status} />
      </div>
      <p className="tnum mt-2 text-body text-ink-soft">
        {sub.id} · podáno {sub.createdAt}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
        {/* Mock PDF document frame. */}
        <Card className="!p-0">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2 text-label text-ink-soft">
            <DocumentIcon size={18} />
            podani-{sub.id}.pdf
          </div>
          <div className="bg-canvas p-6">
            <div className="mx-auto max-w-[520px] bg-paper p-8 shadow-card">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
                <div>
                  <p className="text-h2 font-semibold text-ink">Obec Hvozdnice</p>
                  <p className="text-caption text-ink-soft">Úřad obce · podatelna</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gov-blue-dark text-h2 font-bold text-gov-blue-dark">
                  H
                </span>
              </div>
              <p className="mb-4 text-h2 text-ink">{sub.title}</p>
              <DefinitionList items={sub.detail} />
              {sub.amount > 0 && (
                <p className="tnum mt-4 border-t border-line pt-4 text-body text-ink">
                  Vyměřený poplatek:{' '}
                  <strong>{formatKc(sub.amount)}</strong> ·{' '}
                  {sub.paid ? 'uhrazeno' : 'neuhrazeno'}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Status change with mandatory comment. */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <span className="text-h2 text-ink">Změna stavu</span>
            <div className="flex flex-col gap-2">
              {NEXT.map((n) => {
                const active = status === n.value
                return (
                  <button
                    key={n.value}
                    onClick={() => setStatus(n.value)}
                    className={[
                      'gov-focus flex items-center justify-between rounded-btn border px-4 py-2 text-left text-body transition-colors',
                      active
                        ? 'border-gov-blue bg-gov-blue-tint text-ink'
                        : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
                    ].join(' ')}
                  >
                    <StatusBadge status={n.value} />
                    {active && <span className="text-caption text-gov-blue">vybráno</span>}
                  </button>
                )
              })}
            </div>

            <GovTextarea
              label="Komentář (povinný)"
              placeholder="Popište provedený úkon…"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                setSaved(false)
              }}
              error={
                touched && comment.trim().length < 3
                  ? 'Komentář je povinný — zaznamenává se do spisu.'
                  : undefined
              }
            />

            <GovButton onClick={save} fullWidth>
              Uložit změnu stavu
            </GovButton>
            {saved && (
              <p className="gov-fade text-caption text-success">
                Stav uložen a zapsán do spisu.
              </p>
            )}
          </Card>

          {sub.officerNote && (
            <Card tint>
              <p className="text-caption font-medium text-ink-soft">Poslední záznam</p>
              <p className="mt-2 text-body text-ink">{sub.officerNote}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
