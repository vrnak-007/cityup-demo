import { useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { FormShell } from '../../ui/FormShell'
import { GovButton } from '../../ui/GovButton'
import { GovInput, GovTextarea } from '../../ui/GovInput'
import { Card } from '../../ui/Card'
import { GovMap } from '../../ui/GovMap'
import { CheckIcon, CameraIcon, MapPinIcon } from '../../ui/Icons'
import type { ReportCategory } from '../../lib/types'

const CATEGORIES: ReportCategory[] = ['Výtluk', 'Osvětlení', 'Skládka', 'Jiné']

export function Report() {
  const { addReport } = useApp()
  const navigate = useNavigate()

  const [pick, setPick] = useState<{ lng: number; lat: number } | null>(null)
  const [category, setCategory] = useState<ReportCategory | null>(null)
  const [text, setText] = useState('')
  const [email, setEmail] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const emailValid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  const canSubmit = pick && category && text.trim().length > 3 && emailValid

  const submit = () => {
    setTouched(true)
    if (!pick || !category || text.trim().length <= 3 || !emailValid) return
    const id = addReport({
      category,
      text: text.trim(),
      email,
      lat: pick.lat,
      lng: pick.lng,
      hasPhoto: !!photo,
    })
    setCreatedId(id)
    window.scrollTo({ top: 0 })
  }

  if (createdId) {
    return (
      <FormShell title="Podnět odeslán">
        <Card className="flex flex-col items-center gap-4 py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
            <CheckIcon size={32} />
          </span>
          <p className="text-body text-ink">
            Děkujeme. Podnět jsme předali na úřad.
          </p>
          <p className="tnum text-h2 font-semibold text-ink">{createdId}</p>
          <p className="text-caption text-ink-soft">
            O vyřešení vás budeme informovat e-mailem.
          </p>
        </Card>
        <div className="flex flex-col gap-2">
          <GovButton onClick={() => navigate('obcan/mapa')} fullWidth>
            Zobrazit na veřejné mapě
          </GovButton>
          <GovButton variant="plain" onClick={() => navigate('obcan/uvod')} fullWidth>
            Zpět na úvod
          </GovButton>
        </div>
      </FormShell>
    )
  }

  return (
    <FormShell
      title="Nahlásit podnět"
      subtitle="Závadu nahlásíte i bez přihlášení"
      back="obcan/uvod"
    >
      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Místo na mapě</span>
        <GovMap onPick={(lng, lat) => setPick({ lng, lat })} pick={pick} className="h-72" />
        <p className="text-caption text-ink-soft">
          {pick ? (
            <span className="inline-flex items-center gap-2 text-gov-blue">
              <MapPinIcon size={16} /> Místo vybráno
            </span>
          ) : (
            'Klepnutím do mapy označte místo.'
          )}
        </p>
        {touched && !pick && (
          <p className="text-caption text-error">Označte místo na mapě.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Kategorie</span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={[
                  'gov-focus rounded-full border px-4 py-2 text-label font-medium transition-colors',
                  active
                    ? 'border-gov-blue bg-gov-blue text-white'
                    : 'border-line bg-paper text-ink hover:bg-gov-blue-tint',
                ].join(' ')}
              >
                {c}
              </button>
            )
          })}
        </div>
        {touched && !category && (
          <p className="text-caption text-error">Vyberte kategorii.</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Fotografie (volitelné)</span>
        <label className="gov-focus flex cursor-pointer items-center gap-4 rounded-btn border border-dashed border-line bg-paper px-4 py-4 hover:bg-gov-blue-tint">
          <span className="text-gov-blue">
            <CameraIcon />
          </span>
          <span className="text-body text-ink-soft">
            {photo ? 'Změnit fotografii' : 'Přidat fotografii'}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setPhoto(URL.createObjectURL(f))
            }}
          />
        </label>
        {photo && (
          <img
            src={photo}
            alt="Náhled fotografie"
            className="h-40 w-full rounded-btn border border-line object-cover"
          />
        )}
      </div>

      <GovTextarea
        label="Popis"
        placeholder="Stručně popište závadu…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={touched && text.trim().length <= 3 ? 'Doplňte stručný popis.' : undefined}
      />

      <GovInput
        label="Váš e-mail"
        type="email"
        inputMode="email"
        placeholder="jmeno@email.cz"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={touched && !emailValid ? 'Zadejte platný e-mail pro vyrozumění.' : undefined}
        hint="Na e-mail pošleme potvrzení a stav řešení."
      />

      <GovButton onClick={submit} disabled={!canSubmit} fullWidth>
        Odeslat podnět
      </GovButton>
    </FormShell>
  )
}
