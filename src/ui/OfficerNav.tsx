import { useNavigate, useRoute } from '../lib/router'

const TABS: { screen: string; label: string; hash: string }[] = [
  { screen: 'fronta', label: 'Moje fronta', hash: 'urednik/fronta' },
  { screen: 'poplatky', label: 'Výběr poplatků', hash: 'urednik/poplatky' },
  { screen: 'platby', label: 'Nespárované platby', hash: 'urednik/platby' },
  { screen: 'podnety', label: 'Podněty', hash: 'urednik/podnety' },
]

export function OfficerNav() {
  const { screen } = useRoute()
  const navigate = useNavigate()
  return (
    <nav className="mb-6 flex flex-wrap gap-2 border-b border-line">
      {TABS.map((t) => {
        const active = screen === t.screen
        return (
          <button
            key={t.screen}
            onClick={() => navigate(t.hash)}
            className={[
              'gov-focus -mb-px rounded-t px-4 py-2 text-label font-medium transition-colors',
              active
                ? 'border-b-2 border-gov-blue text-gov-blue'
                : 'border-b-2 border-transparent text-ink-soft hover:text-ink',
            ].join(' ')}
          >
            {t.label}
          </button>
        )
      })}
    </nav>
  )
}
