import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { Card } from '../../ui/Card'
import { StatusBadge } from '../../ui/StatusBadge'
import { Toggle } from '../../ui/Toggle'
import { GovButton } from '../../ui/GovButton'
import { QrIcon, BellIcon, ChevronRightIcon } from '../../ui/Icons'

export function Profile() {
  const { user, submissions, notificationsEnabled, setNotifications } = useApp()
  const navigate = useNavigate()
  const mine = submissions.filter((s) => s.citizen === (user?.name ?? 'Jan Novák'))

  return (
    <div className="mx-auto w-full max-w-form px-4 pb-12 pt-6">
      <h1 className="text-display text-ink">Můj profil</h1>
      <p className="mt-2 text-body text-ink-soft">{user?.name ?? 'Jan Novák'}</p>

      {/* Mock push notification — what the citizen would receive next year. */}
      {notificationsEnabled && (
        <Card tint className="mt-6 flex items-start gap-4">
          <span className="mt-[2px] text-gov-blue">
            <BellIcon />
          </span>
          <div className="flex flex-1 flex-col gap-2">
            <span className="text-body font-medium text-ink">
              Poplatek za psa na rok 2027 je splatný
            </span>
            <span className="text-caption text-ink-soft">
              Splatnost do 31. 3. 2027 · 200 Kč
            </span>
            <GovButton
              variant="secondary"
              onClick={() => navigate('obcan/prihlaseni')}
              className="mt-2 self-start"
            >
              <QrIcon size={18} />
              Zaplatit QR kódem
            </GovButton>
          </div>
        </Card>
      )}

      <h2 className="mt-8 text-h2 text-ink">Historie podání</h2>
      <Card className="mt-4 !p-0">
        {mine.length === 0 ? (
          <p className="p-4 text-body text-ink-soft">Zatím žádná podání.</p>
        ) : (
          <ul>
            {mine.map((s, i) => (
              <li key={s.id}>
                <button
                  onClick={() => navigate('obcan/uvod')}
                  className={`gov-focus flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-gov-blue-tint ${
                    i > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <span className="flex flex-col gap-2">
                    <span className="text-body font-medium text-ink">{s.title}</span>
                    <span className="tnum text-caption text-ink-soft">
                      {s.id} · {s.createdAt} · {formatKc(s.amount)}
                    </span>
                    <StatusBadge status={s.status} />
                  </span>
                  <ChevronRightIcon className="text-ink-soft" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <h2 className="mt-8 text-h2 text-ink">Oznámení</h2>
      <Card className="mt-4 flex items-center justify-between gap-4">
        <span className="flex flex-col">
          <span className="text-body text-ink">Upozornění na splatnost</span>
          <span className="text-caption text-ink-soft">
            Připomeneme poplatky a stav podání.
          </span>
        </span>
        <Toggle
          checked={notificationsEnabled}
          onChange={setNotifications}
          label="Upozornění na splatnost"
        />
      </Card>
    </div>
  )
}
