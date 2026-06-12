import { FormShell } from '../../ui/FormShell'
import { Card } from '../../ui/Card'
import { InfoBar } from '../../ui/InfoBar'
import { GovButton } from '../../ui/GovButton'
import { GovInput, GovTextarea } from '../../ui/GovInput'
import { VerifiedField } from '../../ui/VerifiedField'

export function Grants() {
  return (
    <FormShell
      title="Dotace obce"
      subtitle="Program podpory spolkové činnosti"
      back="obcan/uvod"
    >
      <InfoBar>
        Náhled budoucí agendy — příjem žádostí se spustí ve fázi 3.
      </InfoBar>

      <Card tint className="flex flex-col gap-2">
        <span className="text-h2 text-ink">Podpora spolků 2026</span>
        <p className="text-body text-ink">
          Příspěvek na činnost místních spolků a sdružení v obci Hvozdnice.
        </p>
        <dl className="tnum mt-2 flex flex-col gap-2 text-label">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Alokace programu</dt>
            <dd className="text-ink">300 000 Kč</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Max. na žadatele</dt>
            <dd className="text-ink">50 000 Kč</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Příjem žádostí do</dt>
            <dd className="text-ink">30. 9. 2026</dd>
          </div>
        </dl>
      </Card>

      <h2 className="text-h2 text-ink">Žádost o dotaci</h2>
      <VerifiedField label="Žadatel" value="Jan Novák" />
      <GovInput label="Název spolku" placeholder="např. TJ Sokol Hvozdnice" />
      <GovInput label="IČO" inputMode="numeric" placeholder="12345678" />
      <GovInput
        label="Požadovaná částka"
        inputMode="numeric"
        placeholder="např. 25 000"
      />
      <GovTextarea label="Účel dotace" placeholder="Na co bude příspěvek použit…" />

      <GovButton disabled fullWidth>
        Příjem žádostí zahájíme ve fázi 3
      </GovButton>
    </FormShell>
  )
}
