import { useMemo, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { FormShell } from '../../ui/FormShell'
import { VerifiedField } from '../../ui/VerifiedField'
import { Stepper } from '../../ui/Stepper'
import { Checkbox } from '../../ui/Checkbox'
import { GovInput } from '../../ui/GovInput'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'

const RATE = 200 // Kč za psa a rok

export function DogForm() {
  const { user, setDraft } = useApp()
  const navigate = useNavigate()

  const [count, setCount] = useState(1)
  const [relief, setRelief] = useState(false)
  const [chip, setChip] = useState('')
  const [chipTouched, setChipTouched] = useState(false)

  const total = useMemo(() => {
    const base = count * RATE
    return relief ? base * 0.5 : base
  }, [count, relief])

  // Chip is optional, but if filled must be exactly 15 digits.
  const chipDigits = chip.replace(/\s/g, '')
  const chipError =
    chipTouched && chipDigits.length > 0 && !/^\d{15}$/.test(chipDigits)
      ? 'Zadejte číslo čipu (15 číslic) — najdete ho v očkovacím průkazu.'
      : undefined

  const canContinue = count >= 1 && !chipError

  const submit = () => {
    setChipTouched(true)
    if (count < 1) return
    if (chipDigits.length > 0 && !/^\d{15}$/.test(chipDigits)) return
    setDraft({
      kind: 'pes',
      title: 'Poplatek ze psů 2026',
      amount: total,
      vs: '13852026',
      spdMessage: 'POPLATEK PES NOVAK',
      backTo: 'obcan/psi',
      requiresPayment: true,
      detail: [
        { label: 'Poplatník', value: user?.name ?? 'Jan Novák' },
        { label: 'Adresa', value: user?.address ?? 'Hvozdnice 123' },
        { label: 'Počet psů', value: String(count) },
        { label: 'Úleva 65+ / ZTP', value: relief ? 'Ano (50 %)' : 'Ne' },
        { label: 'Číslo čipu', value: chipDigits || '—' },
      ],
    })
    navigate('obcan/souhrn')
  }

  return (
    <FormShell
      title="Poplatek ze psů"
      subtitle="Roční poplatek na rok 2026"
      back="obcan/uvod"
      footer={
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-caption text-ink-soft">Celkem</span>
            <span className="tnum text-h2 font-semibold text-ink">
              {formatKc(total)}
            </span>
          </div>
          <GovButton onClick={submit} disabled={!canContinue}>
            Pokračovat
          </GovButton>
        </div>
      }
    >
      <VerifiedField label="Jméno a příjmení" value={user?.name ?? 'Jan Novák'} />
      <VerifiedField
        label="Adresa trvalého pobytu"
        value={user?.address ?? 'Hvozdnice 123, 252 05'}
      />

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Počet psů</span>
        <Stepper value={count} onChange={setCount} min={1} max={10} label="počet psů" />
        <p className="text-caption text-ink-soft">
          Sazba {formatKc(RATE)} za jednoho psa a rok.
        </p>
      </div>

      <Card tint className="!p-4">
        <Checkbox
          checked={relief}
          onChange={setRelief}
          label="Uplatnit úlevu 50 %"
          description="Pro občany 65+ a držitele průkazu ZTP/P. Úlevu ověří úřad."
        />
      </Card>

      <GovInput
        label="Číslo čipu (volitelné)"
        inputMode="numeric"
        placeholder="např. 203094100120345"
        value={chip}
        onChange={(e) => setChip(e.target.value)}
        onBlur={() => setChipTouched(true)}
        error={chipError}
        hint={!chipError ? '15 číslic z očkovacího průkazu psa.' : undefined}
      />
    </FormShell>
  )
}
