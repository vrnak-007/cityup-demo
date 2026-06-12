import { FormShell } from '../../ui/FormShell'
import { Card } from '../../ui/Card'
import { InfoBar } from '../../ui/InfoBar'
import { DocumentIcon } from '../../ui/Icons'

const DOCS = [
  { name: 'Žádost o povolení kácení dřeviny', date: '9. 6. 2026', type: 'Podání' },
  { name: 'Doručenka — datová schránka', date: '9. 6. 2026', type: 'Doručenka' },
  { name: 'Usnesení o zahájení řízení', date: '10. 6. 2026', type: 'Rozhodnutí' },
  { name: 'Vyjádření odboru životního prostředí', date: '11. 6. 2026', type: 'Příloha' },
]

export function FileAccess() {
  return (
    <FormShell
      title="Nahlížení do spisu"
      subtitle="Spis sp. zn. ŽP/412/2026"
      back="obcan/profil"
    >
      <InfoBar>
        Vyžaduje napojení na spisovou službu úřadu — dostupné od fáze 3.
      </InfoBar>

      <Card className="!p-0">
        <ul>
          {DOCS.map((doc, i) => (
            <li
              key={doc.name}
              className={`flex items-center gap-4 p-4 ${
                i > 0 ? 'border-t border-line' : ''
              }`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-btn bg-gov-blue-tint text-gov-blue">
                <DocumentIcon />
              </span>
              <span className="flex flex-1 flex-col">
                <span className="text-body font-medium text-ink">{doc.name}</span>
                <span className="tnum text-caption text-ink-soft">
                  {doc.type} · {doc.date}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-caption text-ink-soft">
        Po napojení uvidí občan kompletní obsah spisu v reálném čase, včetně
        doručenek a rozhodnutí.
      </p>
    </FormShell>
  )
}
