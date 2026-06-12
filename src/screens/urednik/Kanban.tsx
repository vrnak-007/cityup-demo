import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { GovButton } from '../../ui/GovButton'
import { CameraIcon, ArrowLeftIcon, ChevronRightIcon } from '../../ui/Icons'
import type { Report, SubmissionStatus } from '../../lib/types'

// Subtle status tints (derived from the palette: gov-blue / warning / success).
const TINT: Record<
  SubmissionStatus,
  { accent: string; column: string; header: string; card: string }
> = {
  novy: {
    accent: '#2362A2',
    column: 'rgba(35,98,162,0.04)',
    header: 'rgba(35,98,162,0.10)',
    card: 'rgba(35,98,162,0.06)',
  },
  reseni: {
    accent: '#B95E00',
    column: 'rgba(185,94,0,0.04)',
    header: 'rgba(185,94,0,0.10)',
    card: 'rgba(185,94,0,0.07)',
  },
  vyrizeno: {
    accent: '#207646',
    column: 'rgba(32,118,70,0.04)',
    header: 'rgba(32,118,70,0.10)',
    card: 'rgba(32,118,70,0.06)',
  },
}

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
      <p className="mt-2 text-body text-ink-soft">
        Otevřete detail kliknutím na podnět, nebo jej posuňte mezi stavy.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const t = TINT[col.status]
          const items = reports.filter((r) => r.status === col.status)
          return (
            <section
              key={col.status}
              className="flex flex-col overflow-hidden rounded-card border border-line"
              style={{ background: t.column, borderTop: `3px solid ${t.accent}` }}
            >
              <header
                className="flex items-center justify-between px-4 py-2"
                style={{ background: t.header }}
              >
                <span className="inline-flex items-center gap-2 text-label font-medium text-ink">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: t.accent }}
                  />
                  {col.title}
                </span>
                <span className="tnum text-caption text-ink-soft">
                  {items.length}
                </span>
              </header>

              <div className="flex flex-1 flex-col gap-4 p-4">
                {items.length === 0 && (
                  <p className="text-caption text-ink-soft">Žádné podněty.</p>
                )}
                {items.map((r) => {
                  const idx = ORDER.indexOf(r.status)
                  return (
                    <article
                      key={r.id}
                      className="overflow-hidden rounded-card border border-line"
                      style={{
                        background: t.card,
                        borderLeft: `4px solid ${t.accent}`,
                      }}
                    >
                      {/* Clickable region → report detail. */}
                      <button
                        type="button"
                        onClick={() => navigate(`urednik/podnet/${r.id}`)}
                        className="gov-focus flex w-full flex-col gap-2 p-4 text-left transition-opacity hover:opacity-80"
                      >
                        <span className="flex items-center gap-2">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-paper text-gov-blue">
                            <CameraIcon size={20} />
                          </span>
                          <span className="flex flex-col">
                            <span className="text-label font-medium text-gov-blue">
                              {r.category}
                            </span>
                            <span className="tnum text-caption text-ink-soft">
                              {r.id}
                            </span>
                          </span>
                          <ChevronRightIcon
                            size={18}
                            className="ml-auto text-ink-soft"
                          />
                        </span>
                        <span className="text-body text-ink">{r.text}</span>
                      </button>

                      {/* Move controls (separate from the detail click). */}
                      <div className="flex items-center justify-between gap-2 px-4 pb-4">
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
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
