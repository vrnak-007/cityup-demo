import { useTenant } from './tenant'
import { WizardShell } from './WizardShell'
import { GovButton } from '../ui/GovButton'
import { Step1, Step2, Step3, Step4, Step5 } from './StepsP1'
import { Step6, Step7, Step8, Step9 } from './StepsP2'
import { Success } from './Success'

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

export function Pruvodce() {
  const { cfg, krok, next, prev, totalKroku, spustit, stopTimer } = useTenant()

  // After launch the wizard is replaced by the success screen.
  if (cfg.spusteno) return <Success />

  const launch = () => {
    stopTimer()
    spustit()
    window.scrollTo({ top: 0 })
  }

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
      case 6:
        return <Step6 />
      case 7:
        return <Step7 />
      case 8:
        return <Step8 />
      case 9:
        return <Step9 onLaunch={launch} />
      default:
        return null
    }
  })()

  return (
    <WizardShell hint={HINTY[krok - 1]} hidePreview={krok === 9}>
      {step}

      <div className="flex items-center justify-between gap-4 border-t border-line pt-6">
        <GovButton variant="plain" onClick={prev} disabled={krok === 1}>
          Zpět
        </GovButton>
        {krok < totalKroku && (
          <div className="flex items-center gap-2">
            <GovButton variant="plain" onClick={next}>
              Přeskočit
            </GovButton>
            <GovButton onClick={next}>Pokračovat</GovButton>
          </div>
        )}
      </div>
    </WizardShell>
  )
}
