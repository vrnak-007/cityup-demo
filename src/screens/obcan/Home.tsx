import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { Tile } from '../../ui/Tile'
import {
  DogIcon,
  TrashIcon,
  DocumentIcon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  ChevronRightIcon,
} from '../../ui/Icons'

const AGENDAS = [
  {
    icon: <DogIcon size={28} />,
    title: 'Psi',
    description: 'Přihlášení psa a platba — 3 minuty',
    // Dog fee requires identity → route through login first.
    target: 'obcan/prihlaseni',
  },
  {
    icon: <TrashIcon size={28} />,
    title: 'Odpad',
    description: 'Poplatek za komunální odpad',
    target: 'obcan/odpad-prihlaseni',
  },
  {
    icon: <DocumentIcon size={28} />,
    title: 'Obecné podání',
    description: 'Žádost nebo podnět na úřad',
    target: 'obcan/podani-prihlaseni',
  },
  {
    icon: <MapPinIcon size={28} />,
    title: 'Podněty',
    description: 'Nahlaste závadu na mapě',
    target: 'obcan/podnet',
  },
  {
    icon: <CalendarIcon size={28} />,
    title: 'Rezervace',
    description: 'Objednání na úřad',
    target: 'obcan/rezervace',
  },
]

export function Home() {
  const navigate = useNavigate()
  const { user } = useApp()

  return (
    <div className="mx-auto w-full max-w-form px-4 pb-12 pt-6">
      <h1 className="text-display text-ink">Vyřiďte to z domova</h1>
      <p className="mt-2 text-body text-ink-soft">
        Agendy obce Hvozdnice na jednom místě. Vyberte, co potřebujete.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {AGENDAS.map((a) => (
          <Tile
            key={a.title}
            icon={a.icon}
            title={a.title}
            description={a.description}
            onClick={() => navigate(a.target)}
          />
        ))}
        <Tile
          icon={<UserIcon size={28} />}
          title="Můj profil"
          description="Historie podání a oznámení"
          onClick={() => navigate('obcan/profil')}
        />
      </div>

      {user && (
        <p className="mt-6 text-caption text-ink-soft">
          Přihlášen: {user.name}
        </p>
      )}

      <button
        onClick={() => navigate('obcan/transparentnost')}
        className="gov-focus mt-6 flex w-full items-center justify-between rounded-card border border-line bg-gov-blue-tint p-4 text-left transition-colors hover:border-gov-blue"
      >
        <span className="flex flex-col">
          <span className="text-body font-medium text-ink">Jak nám to jde</span>
          <span className="text-caption text-ink-soft">
            Veřejné statistiky výkonu úřadu
          </span>
        </span>
        <ChevronRightIcon className="text-gov-blue" />
      </button>

      {/* „Vize" — features coming in a later phase, reachable for the demo. */}
      <h2 className="mt-8 text-h2 text-ink">Připravujeme</h2>
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={() => navigate('obcan/spis')}
          className="gov-focus flex items-center justify-between rounded-card border border-line bg-paper p-4 text-left transition-colors hover:bg-gov-blue-tint"
        >
          <span className="flex flex-col">
            <span className="text-body font-medium text-ink">Nahlížení do spisu</span>
            <span className="text-caption text-ink-soft">
              Sledujte stav svého řízení online
            </span>
          </span>
          <ChevronRightIcon className="text-ink-soft" />
        </button>
        <button
          onClick={() => navigate('obcan/dotace')}
          className="gov-focus flex items-center justify-between rounded-card border border-line bg-paper p-4 text-left transition-colors hover:bg-gov-blue-tint"
        >
          <span className="flex flex-col">
            <span className="text-body font-medium text-ink">Dotace obce</span>
            <span className="text-caption text-ink-soft">
              Žádosti o příspěvky pro spolky
            </span>
          </span>
          <ChevronRightIcon className="text-ink-soft" />
        </button>
      </div>
    </div>
  )
}
