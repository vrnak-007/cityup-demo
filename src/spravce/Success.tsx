import { useTenant } from './tenant'
import { useNavigate } from '../lib/router'
import { Card } from '../ui/Card'
import { GovButton } from '../ui/GovButton'
import { CheckIcon } from '../ui/Icons'
import { formatElapsed } from '../lib/format'

export function Success() {
  const { cfg, finalElapsed } = useTenant()
  const navigate = useNavigate()
  const adresa = `${cfg.subdomena || 'obec'}.cityup.cz`

  return (
    <div className="mx-auto w-full max-w-form px-4 pb-12 pt-12">
      <Card className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon size={32} />
        </span>
        <h1 className="text-display text-ink">
          Portál {cfg.nazev || 'obce Hvozdnice'} je živý
        </h1>
        <a
          href={`https://${adresa}`}
          onClick={(e) => e.preventDefault()}
          className="text-h2 font-semibold text-gov-blue"
        >
          {adresa}
        </a>
        <div className="rounded-btn bg-gov-blue-tint px-4 py-2">
          <span className="tnum text-body text-ink">
            Nastaveno za{' '}
            <strong>
              {finalElapsed != null ? formatElapsed(finalElapsed) : '—'}
            </strong>{' '}
            — bez dodavatele.
          </span>
        </div>
      </Card>

      <div className="mt-6 flex flex-col gap-2">
        <GovButton onClick={() => navigate('obcan/uvod')} fullWidth>
          Zobrazit portál očima občana
        </GovButton>
        <GovButton variant="secondary" onClick={() => navigate('spravce/sprava')} fullWidth>
          Přejít do správy obce
        </GovButton>
      </div>
    </div>
  )
}
