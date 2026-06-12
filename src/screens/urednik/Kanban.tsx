import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { CameraIcon, ArrowLeftIcon, ChevronRightIcon } from '../../ui/Icons'
import { STATUS_COLOR } from '../../ui/StatusBadge'
import type { Report, SubmissionStatus } from '../../lib/types'

const COLUMNS: { status: SubmissionStatus; title: string }[] = [
  { status: 'novy', title: 'Nový' },
  { status: 'reseni', title: 'V řešení' },
  { status: 'vyrizeno', title: 'Vyřešeno' },
]

const ORDER: SubmissionStatus[] = ['novy', 'reseni', 'vyrizeno']

export function Kanban() {
  const { reports, updateReportStatus } = useApp()
  const navigate = useNavigate()

  const move = (r: Report, dir: -1 | 1) => {
    const idx = ORDER.indexOf(r.status)
    const next = ORDER[idx + dir]
    if (next) updateReportStatus(r.id, next)
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
      <h1 className="text-display text-ink">Podněty občanů</h1>
      <p className="mt-2 text-body text-ink-soft">Přesouvejte podněty mezi stavy.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = reports.filter((r) => r.status === col.status)
          return (
            <div key={col.status} className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-label font-medium text-ink">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: STATUS_COLOR[col.status] }}
                  />
                  {col.title}
                </span>
                <span className="tnum text-caption text-ink-soft">{items.length}</span>
              </div>

              <div className="flex flex-col gap-4">
                {items.length === 0 && (
                  <Card className="text-caption text-ink-soft">Žádné podněty.</Card>
                )}
                {items.map((r) => {
                  const idx = ORDER.indexOf(r.status)
                  return (
                    <Card key={r.id} className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-gov-blue-tint text-gov-blue">
                          <CameraIcon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-label font-medium text-gov-blue">
                            {r.category}
                          </span>
                          <span className="tnum text-caption text-ink-soft">{r.id}</span>
                        </div>
                      </div>
                      <p className="text-body text-ink">{r.text}</p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <GovButton
                          variant="secondary"
                          onClick={() => move(r, -1)}
                          disabled={idx === 0}
                          className="!h-10 !px-2"
                        >
                          Zpět
                        </GovButton>
                        <GovButton
                          onClick={() => move(r, 1)}
                          disabled={idx === ORDER.length - 1}
                          className="!h-10 !px-2"
                        >
                          Posunout
                          <ChevronRightIcon size={16} />
                        </GovButton>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
