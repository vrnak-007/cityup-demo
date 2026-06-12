import { useNavigate, useRoute } from '../../lib/router'
import { useApp } from '../../lib/store'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { StatusBadge, STATUS_COLOR } from '../../ui/StatusBadge'
import { GovMap } from '../../ui/GovMap'
import { ArrowLeftIcon, CameraIcon, ChatIcon } from '../../ui/Icons'
import type { SubmissionStatus } from '../../lib/types'

const STATES: { value: SubmissionStatus; label: string }[] = [
  { value: 'novy', label: 'Nový' },
  { value: 'reseni', label: 'V řešení' },
  { value: 'vyrizeno', label: 'Vyřešeno' },
]

export function ReportDetail() {
  const { param } = useRoute()
  const { reports, updateReportStatus, mergeDuplicate } = useApp()
  const navigate = useNavigate()
  const report = reports.find((r) => r.id === param)
  const duplikat = report?.duplicitOf
    ? reports.find((r) => r.id === report.duplicitOf)
    : undefined

  if (!report) {
    return (
      <div className="mx-auto w-full max-w-app px-4 py-12">
        <p className="text-body text-ink-soft">Podnět nenalezen.</p>
        <GovButton variant="plain" onClick={() => navigate('urednik/podnety')}>
          Zpět na podněty
        </GovButton>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <button
        type="button"
        onClick={() => navigate('urednik/podnety')}
        className="gov-focus mb-4 inline-flex items-center gap-2 rounded text-label font-medium text-gov-blue hover:underline"
      >
        <ArrowLeftIcon size={18} />
        Zpět na podněty
      </button>

      <div className="flex items-center justify-between gap-4">
        <h1 className="text-display text-ink">{report.category}</h1>
        <StatusBadge status={report.status} />
      </div>
      <p className="tnum mt-2 text-body text-ink-soft">
        {report.id} · nahlášeno {report.createdAt}
      </p>

      {/* Možný duplikát (P3.11). */}
      {duplikat && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-gov-blue-tint px-4 py-4">
          <p className="text-body text-ink">
            Možný duplicitní podnět {report.duplicitVzdalenost} m odtud (
            <span className="tnum">{duplikat.id}</span>, {duplikat.category}).
          </p>
          <div className="flex gap-2">
            <GovButton onClick={() => mergeDuplicate(report.id, duplikat.id)}>
              Sloučit
            </GovButton>
            <GovButton
              variant="secondary"
              onClick={() => mergeDuplicate(report.id, '')}
            >
              Ponechat
            </GovButton>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {report.hasPhoto && (
            <div className="flex h-40 items-center justify-center rounded-card border border-line bg-gov-blue-tint text-gov-blue">
              <CameraIcon size={32} />
            </div>
          )}
          <Card>
            <p className="text-body text-ink">{report.text}</p>
            <p className="mt-4 text-caption text-ink-soft">
              Kontakt: <span className="text-ink">{report.email}</span>
            </p>
          </Card>
          <GovMap
            markers={[
              {
                id: report.id,
                lng: report.lng,
                lat: report.lat,
                color: STATUS_COLOR[report.status],
              },
            ]}
            center={[report.lng, report.lat]}
            className="h-72"
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* Auto-routing (P3.10). */}
          <Card tint className="flex flex-col gap-2">
            <span className="text-caption font-medium text-ink-soft">
              Automaticky přiděleno
            </span>
            <span className="text-body font-medium text-ink">{report.odbor}</span>
            <span className="text-caption text-ink-soft">
              pravidlo {report.category} → {report.odbor}
            </span>
          </Card>

          <Card className="flex flex-col gap-4">
            <span className="text-h2 text-ink">Změna stavu</span>
            <div className="flex flex-col gap-2">
              {STATES.map((s) => {
                const active = report.status === s.value
                return (
                  <button
                    key={s.value}
                    onClick={() => updateReportStatus(report.id, s.value)}
                    className={[
                      'gov-focus flex items-center justify-between rounded-btn border px-4 py-2 text-left text-body transition-colors',
                      active
                        ? 'border-gov-blue bg-gov-blue-tint text-ink'
                        : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
                    ].join(' ')}
                  >
                    <StatusBadge status={s.value} />
                    {active && (
                      <span className="text-caption text-gov-blue">aktuální</span>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>

          {report.response && (
            <Card tint className="flex items-start gap-2">
              <span className="mt-[2px] text-gov-blue">
                <ChatIcon size={18} />
              </span>
              <div className="flex flex-col">
                <span className="text-caption font-medium text-ink-soft">
                  Odpověď obce
                </span>
                <span className="text-body text-ink">{report.response}</span>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
