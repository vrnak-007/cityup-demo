import { useMemo, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { formatKc } from '../../lib/format'
import { buildSpd } from '../../lib/spd'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'
import { QrCode } from '../../ui/QrCode'

const ACCOUNT = 'CZ6508000000001234567890'

export function Payment() {
  const { draft, activeId, markPaid } = useApp()
  const navigate = useNavigate()
  const [cardPaying, setCardPaying] = useState(false)

  const spd = useMemo(() => {
    if (!draft) return ''
    return buildSpd({
      account: ACCOUNT,
      amount: draft.amount,
      vs: draft.vs,
      message: draft.spdMessage,
    })
  }, [draft])

  if (!draft) {
    navigate('obcan/uvod')
    return null
  }

  const finish = () => {
    if (activeId) markPaid(activeId)
    navigate('obcan/stav')
  }

  const payByCard = () => {
    setCardPaying(true)
    window.setTimeout(finish, 2000)
  }

  return (
    <FormShell title="Platba" subtitle={draft.title}>
      <Card className="flex flex-col items-center gap-4 text-center">
        <span className="text-caption text-ink-soft">Částka k úhradě</span>
        <span className="tnum text-display text-ink">{formatKc(draft.amount)}</span>

        <div className="rounded-card border border-line bg-white p-4">
          <QrCode value={spd} size={240} />
        </div>
        <p className="text-caption text-ink-soft">Naskenujte bankovní aplikací</p>

        <dl className="tnum flex w-full flex-col gap-2 text-left text-caption text-ink-soft">
          <div className="flex justify-between">
            <dt>Číslo účtu</dt>
            <dd className="text-ink">{ACCOUNT}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Variabilní symbol</dt>
            <dd className="text-ink">{draft.vs}</dd>
          </div>
        </dl>
      </Card>

      <div className="flex flex-col gap-2">
        <GovButton onClick={finish} fullWidth>
          Zaplaceno z banky
        </GovButton>
        <GovButton variant="secondary" onClick={payByCard} disabled={cardPaying} fullWidth>
          {cardPaying ? 'Zpracováváme platbu…' : `Zaplatit kartou ${formatKc(draft.amount)}`}
        </GovButton>
      </div>
    </FormShell>
  )
}
