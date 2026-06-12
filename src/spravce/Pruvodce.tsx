import { useTenant } from './tenant'
import { WizardShell } from './WizardShell'
import { GovButton } from '../ui/GovButton'
import { Step1, Step2, Step3, Step4, Step5 } from './StepsP1'

const HINTY = [
  'Načtěte údaje obce z ARES — stačí IČO, zbytek se doplní sám.',
  'Zvolte adresu, na které bude portál pro občany dostupný.',
  'Zapněte agendy, které chcete občanům nabídnout. Změna se hned projeví v náhledu.',
  'Opište sazby z vaší vyhlášky — průběžně kontrolujeme výpočet.',
  'Zadejte účet obce a vyzkoušejte skutečnou QR platbu.',
  'Nastavte, kam se podání doručují. Manuální fronta je vždy záchranná síť.',
  'Pozvěte úředníky a přidělte jim agendy. Každý účet má dvoufázové ověření.',
  'Upravte uvítací text a připravte oznámení pro občany.',
  'Zkontrolujte připravenost a spusťte portál pro občany.',
]

function Placeholder({ n }: { n: number }) {
  return (
    <p className="text-body text-ink-soft">
      Krok {n} — připravujeme v této části dema.
    </p>
  )
}

export function Pruvodce() {
  const { krok, next, prev, totalKroku } = useTenant()

  const step = (() => {
    switch (krok) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 />
      case 3:
        return <Step3 />
      case 4:
        return <Step4 />
      case 5:
        return <Step5 />
      default:
        return <Placeholder n={krok} />
    }
  })()

  return (
    <WizardShell hint={HINTY[krok - 1]}>
      {step}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <GovButton variant="plain" onClick={prev} disabled={krok === 1}>
          Zpět
        </GovButton>
        <div className="flex items-center gap-2">
          <GovButton variant="plain" onClick={next} disabled={krok === totalKroku}>
            Přeskočit
          </GovButton>
          <GovButton onClick={next} disabled={krok === totalKroku}>
            Pokračovat
          </GovButton>
        </div>
      </div>
    </WizardShell>
  )
}
