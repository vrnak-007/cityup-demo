import { useEffect, useRef, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatElapsed, formatKc } from '../../lib/format'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'
import { Timeline } from '../../ui/Timeline'
import { CheckIcon } from '../../ui/Icons'
import type { TimelineStep } from '../../lib/types'

export function Status() {
  const { draft, activeId, stopTimer, advanceToDelivered } = useApp()
  const navigate = useNavigate()
  const [delivered, setDelivered] = useState(false)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const measuredRef = useRef(false)

  useEffect(() => {
    // Capture the real elapsed time from login to here — exactly once.
    if (!measuredRef.current) {
      measuredRef.current = true
      setElapsed(stopTimer())
    }
    // The receipt lands at the office a beat later — the one orchestrated moment.
    // Timeout is (re)created every effect run so StrictMode's cleanup can't drop it.
    const t = window.setTimeout(() => {
      setDelivered(true)
      if (activeId) advanceToDelivered(activeId)
    }, 3000)
    return () => window.clearTimeout(t)
  }, [stopTimer, advanceToDelivered, activeId])

  if (!draft) {
    navigate('obcan/uvod')
    return null
  }

  const steps: TimelineStep[] = [
    { label: 'Podáno', state: 'done', time: '12. 6. 2026' },
    ...(draft.requiresPayment
      ? [
          {
            label: `Zaplaceno · ${formatKc(draft.amount)}`,
            state: 'done' as const,
            time: '12. 6. 2026',
          },
        ]
      : []),
    {
      label: 'Doručeno úřadu',
      state: delivered ? 'done' : 'pending',
      time: delivered ? 'právě teď' : undefined,
    },
    {
      label: 'Vyřízeno',
      state: 'future',
      note: 'obvykle do 5 dnů',
    },
  ]

  return (
    <FormShell title="Stav podání">
      <Card className="flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon size={24} />
        </span>
        <div className="flex flex-col">
          <span className="text-h2 font-semibold text-ink">Hotovo</span>
          <span className="tnum text-body text-ink-soft">
            {elapsed != null ? `Vyřízeno za ${formatElapsed(elapsed)}` : 'Vyřízeno'}
          </span>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-label text-ink-soft">Číslo podání</span>
          <span className="tnum text-label font-medium text-ink">{activeId}</span>
        </div>
        <Timeline steps={steps} />
      </Card>

      <div className="flex flex-col gap-2">
        <GovButton onClick={() => navigate('obcan/profil')} fullWidth>
          Přejít do profilu
        </GovButton>
        <GovButton variant="plain" onClick={() => navigate('obcan/uvod')} fullWidth>
          Zpět na úvod
        </GovButton>
      </div>
    </FormShell>
  )
}
