import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { StatusBadge } from '../../ui/StatusBadge'
import { GovButton } from '../../ui/GovButton'

const KIND_LABEL: Record<string, string> = {
  pes: 'Psi',
  odpad: 'Odpad',
  obecne: 'Obecné podání',
}

export function Queue() {
  const { submissions } = useApp()
  const navigate = useNavigate()

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display text-ink">Podání k vyřízení</h1>
          <p className="mt-2 text-body text-ink-soft">
            Fronta agend obce Hvozdnice
          </p>
        </div>
        <GovButton variant="secondary" onClick={() => navigate('urednik/podnety')}>
          Podněty (kanban)
        </GovButton>
      </div>

      <div className="mt-6 overflow-hidden rounded-card border border-line bg-paper">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-label text-ink-soft">
              <th className="px-4 py-2 font-medium">Číslo</th>
              <th className="px-4 py-2 font-medium">Agenda</th>
              <th className="px-4 py-2 font-medium">Poplatník</th>
              <th className="px-4 py-2 text-right font-medium">Částka</th>
              <th className="px-4 py-2 font-medium">Stav</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s, i) => (
              <tr
                key={s.id}
                className={`h-12 border-b border-line last:border-0 ${
                  i % 2 === 1 ? 'bg-canvas' : 'bg-paper'
                }`}
              >
                <td className="tnum px-4 text-label text-ink">{s.id}</td>
                <td className="px-4 text-body text-ink">{KIND_LABEL[s.kind]}</td>
                <td className="px-4 text-body text-ink">{s.citizen}</td>
                <td className="tnum px-4 text-right text-body text-ink">
                  {s.amount > 0 ? formatKc(s.amount) : '—'}
                </td>
                <td className="px-4">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 text-right">
                  <button
                    onClick={() => navigate(`urednik/detail/${s.id}`)}
                    className="gov-focus rounded px-2 py-1 text-label font-medium text-gov-blue hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
