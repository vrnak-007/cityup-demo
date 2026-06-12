import { useState } from 'react'
import { useApp } from '../../lib/store'
import { OfficerNav } from '../../ui/OfficerNav'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { CheckIcon } from '../../ui/Icons'
import { formatKc } from '../../lib/format'

export function NesparovanePlatby() {
  const { prichoziPlatby, sparovatPlatbu } = useApp()
  const [justMatched, setJustMatched] = useState<string | null>(null)

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <OfficerNav />
      <h1 className="text-display text-ink">Nespárované platby</h1>
      <p className="mt-2 text-body text-ink-soft">
        Příchozí platby bez rozpoznaného variabilního symbolu
      </p>

      {prichoziPlatby.length === 0 ? (
        <Card className="mt-6 flex items-center gap-2">
          <span className="text-success">
            <CheckIcon />
          </span>
          <span className="text-body text-ink">
            Všechny platby jsou spárované.
            {justMatched && ` Naposledy: ${justMatched}.`}
          </span>
        </Card>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {prichoziPlatby.map((pl) => (
            <Card key={pl.id} className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-2">
                <span className="tnum text-h2 text-ink">{formatKc(pl.castka)}</span>
                <span className="tnum text-caption text-ink-soft">
                  {pl.datum} · zpráva: „{pl.zprava}"
                </span>
                <div className="mt-2 flex items-start gap-2 rounded-btn bg-gov-blue-tint px-4 py-2">
                  <span className="mt-[2px] text-gov-blue">
                    <CheckIcon size={18} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-label font-medium text-ink">
                      Návrh: pravděpodobně {pl.navrhJmeno}
                    </span>
                    <span className="text-caption text-ink-soft">
                      {pl.navrhDuvod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <GovButton
                  onClick={() => {
                    setJustMatched(`${pl.navrhJmeno} (${formatKc(pl.castka)})`)
                    sparovatPlatbu(pl.id)
                  }}
                >
                  Spárovat s {pl.navrhJmeno}
                </GovButton>
                <GovButton variant="secondary" onClick={() => undefined}>
                  Vybrat ručně
                </GovButton>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
