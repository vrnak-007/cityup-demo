import { useEffect, useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { Card } from '../../ui/Card'
import { ShieldIcon } from '../../ui/Icons'

interface Props {
  next: string // hash to continue to after a successful login
  agenda: string // human label, e.g. „Poplatek ze psů"
}

// Screen 2. Starts the real timer the success banner later reports on.
export function Login({ next, agenda }: Props) {
  const { login, startTimer } = useApp()
  const navigate = useNavigate()
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    startTimer()
  }, [startTimer])

  const handle = () => {
    setVerifying(true)
    window.setTimeout(() => {
      login()
      navigate(next)
    }, 1500)
  }

  return (
    <FormShell title={agenda} subtitle="Pro pokračování se přihlaste" back="obcan/uvod">
      <Card className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gov-blue-tint text-gov-blue">
          <ShieldIcon size={32} />
        </span>
        <div className="flex flex-col gap-2">
          <p className="text-body text-ink">
            Přihlášení přes <strong>Identitu občana</strong> ověří vaše údaje.
          </p>
          <p className="text-caption text-ink-soft">
            Jméno a adresu pak nemusíte vypisovat.
          </p>
        </div>
        <GovButton onClick={handle} disabled={verifying} fullWidth>
          {verifying ? 'Ověřujeme totožnost…' : 'Přihlásit Identitou občana'}
        </GovButton>
      </Card>
    </FormShell>
  )
}
