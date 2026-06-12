import { useMemo, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'
import { CheckIcon, CalendarIcon } from '../../ui/Icons'

const AGENDAS = ['Ověřování podpisů', 'Matrika', 'Stavební úřad']
const TIMES = ['9:00', '10:00', '11:00', '14:00', '15:00']
const DAYS_CZ = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So']

interface Slot {
  key: string
  dayLabel: string
  time: string
  taken: boolean
}

// Build the next ~2 weeks of working-day slots, deterministically „taken".
function buildDays() {
  const start = new Date('2026-06-15T00:00:00') // Monday after the demo date
  const days: { label: string; slots: Slot[] }[] = []
  for (let d = 0; d < 14 && days.length < 10; d++) {
    const date = new Date(start)
    date.setDate(start.getDate() + d)
    const dow = date.getDay()
    if (dow === 0 || dow === 6) continue // skip weekends
    const label = `${DAYS_CZ[dow]} ${date.getDate()}. ${date.getMonth() + 1}.`
    const slots: Slot[] = TIMES.map((time, ti) => ({
      key: `${d}-${ti}`,
      dayLabel: label,
      time,
      // Deterministic pseudo-occupancy.
      taken: (d * 7 + ti * 3) % 5 === 0,
    }))
    days.push({ label, slots })
  }
  return days
}

export function Reservation() {
  const navigate = useNavigate()
  const days = useMemo(buildDays, [])
  const [agenda, setAgenda] = useState(AGENDAS[0])
  const [selected, setSelected] = useState<Slot | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  if (confirmed && selected) {
    return (
      <FormShell title="Rezervace potvrzena">
        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
            <CheckIcon size={32} />
          </span>
          <p className="text-body text-ink">{agenda}</p>
          <p className="tnum text-h2 font-semibold text-ink">
            {selected.dayLabel} · {selected.time}
          </p>
          <p className="text-caption text-ink-soft">
            Dostavte se prosím 5 minut předem na úřad obce Hvozdnice.
          </p>
        </Card>
        <div className="flex flex-col gap-2">
          <GovButton onClick={() => undefined} fullWidth>
            <CalendarIcon size={18} />
            Přidat do kalendáře
          </GovButton>
          <GovButton variant="plain" onClick={() => navigate('obcan/uvod')} fullWidth>
            Zpět na úvod
          </GovButton>
        </div>
      </FormShell>
    )
  }

  return (
    <FormShell
      title="Rezervace na úřad"
      subtitle="Vyberte agendu a volný termín"
      back="obcan/uvod"
      footer={
        <GovButton onClick={() => setConfirmed(true)} disabled={!selected} fullWidth>
          {selected
            ? `Rezervovat ${selected.dayLabel} ${selected.time}`
            : 'Vyberte termín'}
        </GovButton>
      }
    >
      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Agenda</span>
        <div className="flex flex-wrap gap-2">
          {AGENDAS.map((a) => {
            const active = agenda === a
            return (
              <button
                key={a}
                type="button"
                onClick={() => setAgenda(a)}
                className={[
                  'gov-focus rounded-full border px-4 py-2 text-label font-medium transition-colors',
                  active
                    ? 'border-gov-blue bg-gov-blue text-white'
                    : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
                ].join(' ')}
              >
                {a}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <span className="text-label font-medium text-ink">Volné termíny</span>
        {days.map((day) => (
          <div key={day.label} className="flex flex-col gap-2">
            <span className="text-caption text-ink-soft">{day.label}</span>
            <div className="flex flex-wrap gap-2">
              {day.slots.map((slot) => {
                const isSelected = selected?.key === slot.key
                if (slot.taken) {
                  return (
                    <span
                      key={slot.key}
                      className="tnum cursor-not-allowed rounded-btn border border-line px-4 py-2 text-label text-ink-soft line-through"
                    >
                      {slot.time}
                    </span>
                  )
                }
                return (
                  <button
                    key={slot.key}
                    type="button"
                    onClick={() => setSelected(slot)}
                    className={[
                      'gov-focus tnum rounded-btn border px-4 py-2 text-label font-medium transition-colors',
                      isSelected
                        ? 'border-gov-blue bg-gov-blue text-white'
                        : 'border-gov-blue/30 bg-gov-blue-tint text-gov-blue hover:border-gov-blue',
                    ].join(' ')}
                  >
                    {slot.time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </FormShell>
  )
}
