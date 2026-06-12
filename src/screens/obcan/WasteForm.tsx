import { useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { FormShell } from '../../ui/FormShell'
import { VerifiedField } from '../../ui/VerifiedField'
import { Stepper } from '../../ui/Stepper'
import { GovButton } from '../../ui/GovButton'

const RATE = 600 // Kč za osobu a rok

export function WasteForm() {
  const { user, setDraft } = useApp()
  const navigate = useNavigate()
  const [people, setPeople] = useState(1)

  const total = people * RATE

  const submit = () => {
    setDraft({
      kind: 'odpad',
      title: 'Poplatek za odpad 2026',
      amount: total,
      vs: '34002026',
      spdMessage: 'POPLATEK ODPAD NOVAK',
      backTo: 'obcan/odpad',
      requiresPayment: true,
      detail: [
        { label: 'Poplatník', value: user?.name ?? 'Jan Novák' },
        { label: 'Nemovitost', value: user?.address ?? 'Hvozdnice 123' },
        { label: 'Počet osob', value: String(people) },
      ],
    })
    navigate('obcan/souhrn')
  }

  return (
    <FormShell
      title="Poplatek za odpad"
      subtitle="Komunální odpad, rok 2026"
      back="obcan/uvod"
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-caption text-ink-soft">Celkem</span>
            <span className="tnum text-h2 font-semibold text-ink">
              {formatKc(total)}
            </span>
          </div>
          <GovButton onClick={submit}>Pokračovat</GovButton>
        </div>
      }
    >
      <VerifiedField label="Jméno a příjmení" value={user?.name ?? 'Jan Novák'} />
      <VerifiedField
        label="Nemovitost"
        value={user?.address ?? 'Hvozdnice 123, 252 05'}
      />

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">
          Počet osob v domácnosti
        </span>
        <Stepper value={people} onChange={setPeople} min={1} max={12} label="počet osob" />
        <p className="text-caption text-ink-soft">
          Sazba {formatKc(RATE)} za osobu a rok.
        </p>
      </div>
    </FormShell>
  )
}
