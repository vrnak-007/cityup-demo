import { useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'
import { Checkbox } from '../../ui/Checkbox'
import { DefinitionList } from '../../ui/DefinitionList'

export function Summary() {
  const { draft, submitDraft } = useApp()
  const navigate = useNavigate()
  const [agree, setAgree] = useState(false)
  const [sending, setSending] = useState(false)

  if (!draft) {
    navigate('obcan/uvod')
    return null
  }

  const send = () => {
    if (!agree) return
    setSending(true)
    window.setTimeout(() => {
      submitDraft()
      // Fee agendas go to payment; free submissions go straight to status.
      navigate(draft.requiresPayment ? 'obcan/platba' : 'obcan/stav')
    }, 1000)
  }

  return (
    <FormShell
      title="Souhrn podání"
      subtitle="Zkontrolujte údaje před odesláním"
      back={draft.backTo}
      footer={
        <div className="flex items-center justify-between gap-4">
          {draft.requiresPayment ? (
            <div className="flex flex-col">
              <span className="text-caption text-ink-soft">K úhradě</span>
              <span className="tnum text-h2 font-semibold text-ink">
                {formatKc(draft.amount)}
              </span>
            </div>
          ) : (
            <span className="text-caption text-ink-soft">
              Podání bude předáno na úřad
            </span>
          )}
          <GovButton onClick={send} disabled={!agree || sending}>
            {sending ? 'Podáváme…' : 'Odeslat podání'}
          </GovButton>
        </div>
      }
    >
      <Card>
        <h2 className="mb-2 text-h2 text-ink">{draft.title}</h2>
        <DefinitionList items={draft.detail} />
      </Card>

      <Card tint>
        <Checkbox
          checked={agree}
          onChange={setAgree}
          label="Čestně prohlašuji, že uvedené údaje jsou pravdivé a úplné."
          description="Podání má stejnou platnost jako podpis na úřadě."
        />
      </Card>
    </FormShell>
  )
}
