import { useState } from 'react'
import { useTenant, AGENDA_META } from './tenant'
import { GovInput } from '../ui/GovInput'
import { GovButton } from '../ui/GovButton'
import { VerifiedField } from '../ui/VerifiedField'
import { Card } from '../ui/Card'
import { Toggle } from '../ui/Toggle'
import { InfoBar } from '../ui/InfoBar'
import { QrCode } from '../ui/QrCode'
import { buildSpd } from '../lib/spd'
import { formatKc } from '../lib/format'
import { CheckIcon } from '../ui/Icons'

// ---- Krok 1: Obec ----
export function Step1() {
  const { cfg, set } = useTenant()
  const [loading, setLoading] = useState(false)

  const nacist = () => {
    setLoading(true)
    window.setTimeout(() => {
      set('ico', cfg.ico || '00241270')
      set('nazev', 'Obec Hvozdnice')
      set('adresa', 'Hvozdnice 1, 252 05 Hvozdnice')
      set('isds', 'h3vzd9q')
      set('aresLoaded', true)
      setLoading(false)
    }, 1000)
  }

  return (
    <>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <GovInput
            label="IČO obce"
            inputMode="numeric"
            placeholder="např. 00241270"
            value={cfg.ico}
            onChange={(e) => set('ico', e.target.value)}
            hint="Najdete na razítku obce nebo ve vyhlášce."
          />
        </div>
        <GovButton onClick={nacist} disabled={loading}>
          {loading ? 'Načítáme…' : 'Načíst z ARES'}
        </GovButton>
      </div>

      {cfg.aresLoaded && (
        <>
          <VerifiedField label="Název obce" value={cfg.nazev} caption="Ověřeno v ARES" />
          <VerifiedField label="Adresa úřadu" value={cfg.adresa} caption="Ověřeno v ARES" />
          <VerifiedField
            label="ID datové schránky"
            value={cfg.isds}
            caption="Ověřeno v ARES"
          />
        </>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Znak obce (volitelné)</span>
        <div className="flex items-center gap-4">
          {cfg.znak ? (
            <img
              src={cfg.znak}
              alt="Znak obce"
              className="h-16 w-16 rounded-full border border-line object-cover"
            />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-line bg-gov-blue-tint text-h2 font-bold text-gov-blue">
              {(cfg.nazev.replace(/^Obec\s+/i, '')[0] ?? 'H').toUpperCase()}
            </span>
          )}
          <label className="gov-focus cursor-pointer rounded-btn border border-line bg-paper px-4 py-2 text-label font-medium text-gov-blue hover:bg-gov-blue-tint">
            {cfg.znak ? 'Změnit znak' : 'Nahrát znak'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  const reader = new FileReader()
                  reader.onload = () => set('znak', String(reader.result))
                  reader.readAsDataURL(f)
                }
              }}
            />
          </label>
        </div>
      </div>

      <GovInput
        label="E-mail podatelny"
        type="email"
        placeholder="podatelna@hvozdnice.cz"
        value={cfg.email}
        onChange={(e) => set('email', e.target.value)}
      />
      <GovInput
        label="Telefon podatelny"
        inputMode="tel"
        placeholder="257 000 000"
        value={cfg.telefon}
        onChange={(e) => set('telefon', e.target.value)}
      />
    </>
  )
}

// ---- Krok 2: Adresa portálu ----
export function Step2() {
  const { cfg, set } = useTenant()
  const subOk = cfg.subdomena.trim().length >= 3
  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="text-label font-medium text-ink">Adresa portálu</label>
        <div className="flex items-center gap-2">
          <input
            value={cfg.subdomena}
            onChange={(e) =>
              set('subdomena', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }
            className="gov-focus h-12 w-40 rounded-btn border border-line bg-paper px-4 text-right text-body text-ink"
          />
          <span className="text-body text-ink-soft">.cityup.cz</span>
        </div>
        {subOk && (
          <p className="inline-flex items-center gap-2 text-caption text-success">
            <CheckIcon size={16} /> Adresa je k dispozici
          </p>
        )}
      </div>

      <GovInput
        label="Vlastní doména (volitelné)"
        placeholder="napr. obecni-urad.hvozdnice.cz"
        value={cfg.vlastniDomena}
        onChange={(e) => set('vlastniDomena', e.target.value)}
      />
      {cfg.vlastniDomena.trim().length > 0 && (
        <InfoBar>
          Vlastní doména vyžaduje DNS záznam — návod vám zašleme e-mailem. Portál
          mezitím běží na adrese {cfg.subdomena || 'obec'}.cityup.cz.
        </InfoBar>
      )}
    </>
  )
}

// ---- Krok 3: Agendy ----
export function Step3() {
  const { cfg, set } = useTenant()
  return (
    <div className="flex flex-col gap-4">
      {AGENDA_META.map((a) => (
        <Card key={a.key} className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-body font-medium text-ink">{a.nazev}</span>
            <span className="text-caption text-ink-soft">{a.popis}</span>
            <span className="mt-2 text-caption text-ink-soft">{a.pravni}</span>
          </div>
          <Toggle
            checked={cfg.agendy[a.key]}
            onChange={(v) => set('agendy', { ...cfg.agendy, [a.key]: v })}
            label={a.nazev}
          />
        </Card>
      ))}
    </div>
  )
}

// ---- Krok 4: Sazby z OZV ----
function SazbaInput({
  otazka,
  value,
  onChange,
  suffix = 'Kč',
}: {
  otazka: string
  value: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-body text-ink">{otazka}</label>
      <div className="flex items-center gap-2">
        <input
          inputMode="numeric"
          value={value}
          onChange={(e) => onChange(Number(e.target.value.replace(/\D/g, '')) || 0)}
          className="gov-focus h-12 w-32 rounded-btn border border-line bg-paper px-4 text-right text-body text-ink"
        />
        <span className="text-body text-ink-soft">{suffix}</span>
      </div>
    </div>
  )
}

export function Step4() {
  const { cfg, set } = useTenant()
  // Kontrolní kalkulačka: Jan Novák, 2 psi, 67 let.
  const zaklad = cfg.pesPrvni + cfg.pesDalsi
  const poSleve = Math.round(zaklad * (1 - cfg.pesSleva / 100))

  return (
    <>
      <Card tint className="flex flex-col gap-4">
        <span className="text-label font-medium text-ink">Poplatek ze psů</span>
        <SazbaInput
          otazka="Kolik platí občan za prvního psa ročně?"
          value={cfg.pesPrvni}
          onChange={(v) => set('pesPrvni', v)}
        />
        <SazbaInput
          otazka="A za každého dalšího psa?"
          value={cfg.pesDalsi}
          onChange={(v) => set('pesDalsi', v)}
        />
        <SazbaInput
          otazka="Sleva pro držitele 65+?"
          value={cfg.pesSleva}
          onChange={(v) => set('pesSleva', v)}
          suffix="%"
        />
        <div className="flex flex-col gap-2">
          <label className="text-body text-ink">Splatnost poplatku?</label>
          <input
            value={cfg.pesSplatnost}
            onChange={(e) => set('pesSplatnost', e.target.value)}
            className="gov-focus h-12 w-32 rounded-btn border border-line bg-paper px-4 text-body text-ink"
          />
        </div>
      </Card>

      <Card tint className="flex flex-col gap-4">
        <span className="text-label font-medium text-ink">Poplatek za odpad</span>
        <SazbaInput
          otazka="Kolik platí občan za osobu ročně?"
          value={cfg.odpadOsoba}
          onChange={(v) => set('odpadOsoba', v)}
        />
      </Card>

      {/* Živá kontrolní kalkulačka */}
      <Card className="flex flex-col gap-2 border-gov-blue">
        <span className="text-caption font-medium text-ink-soft">
          Kontrolní výpočet
        </span>
        <span className="text-body text-ink">
          Jan Novák, 2 psi, 67 let →{' '}
          <strong className="tnum">{formatKc(poSleve)}</strong>
        </span>
        <span className="tnum text-caption text-ink-soft">
          {formatKc(cfg.pesPrvni)} + {formatKc(cfg.pesDalsi)} = {formatKc(zaklad)}, sleva{' '}
          {cfg.pesSleva} % → {formatKc(poSleve)}
        </span>
      </Card>

      <p className="text-caption text-ink-soft">
        Hodnoty opište z vaší obecně závazné vyhlášky (OZV).
      </p>
    </>
  )
}

// ---- Krok 5: Platby ----
export function Step5() {
  const { cfg, set } = useTenant()
  const [testing, setTesting] = useState(false)
  const [tested, setTested] = useState(false)

  const vs = `${cfg.vsAgenda}${cfg.vsRok}${cfg.vsPoradi}`
  const uctOk = /^[0-9-]{6,}\/[0-9]{4}$/.test(cfg.ucet.trim())

  const spd = buildSpd({
    account: 'CZ6508000000001234567890',
    amount: 1,
    vs,
    message: `TEST ${cfg.nazev || 'OBEC'}`,
  })

  const test = () => {
    setTesting(true)
    window.setTimeout(() => {
      setTesting(false)
      setTested(true)
    }, 3000)
  }

  return (
    <>
      <GovInput
        label="Číslo účtu obce"
        placeholder="123456789/0800"
        value={cfg.ucet}
        onChange={(e) => {
          set('ucet', e.target.value)
          setTested(false)
        }}
        error={
          cfg.ucet.length > 0 && !uctOk
            ? 'Zadejte číslo účtu ve formátu 123456789/0800.'
            : undefined
        }
        hint={uctOk ? 'Formát čísla účtu je v pořádku.' : undefined}
      />

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">
          Variabilní symbol — složení
        </span>
        <div className="flex flex-wrap items-end gap-2">
          <Segment label="agenda" value={cfg.vsAgenda} onChange={(v) => set('vsAgenda', v)} w="w-20" />
          <Segment label="rok" value={cfg.vsRok} onChange={(v) => set('vsRok', v)} w="w-16" />
          <Segment label="pořadí" value={cfg.vsPoradi} onChange={(v) => set('vsPoradi', v)} w="w-24" />
          <div className="flex flex-col gap-2">
            <span className="text-caption text-ink-soft">ukázka</span>
            <span className="tnum flex h-12 items-center rounded-btn bg-gov-blue-tint px-4 text-body font-semibold text-gov-blue">
              {vs}
            </span>
          </div>
        </div>
      </div>

      <Card className="flex flex-col items-center gap-4 text-center">
        <span className="text-label font-medium text-ink">Vyzkoušet QR platbu 1 Kč</span>
        <div className="rounded-card border border-line bg-white p-4">
          <QrCode value={spd} size={180} />
        </div>
        <p className="text-caption text-ink-soft">
          Naskenujte vlastní bankou — platba dorazí na váš účet.
        </p>
        <GovButton onClick={test} disabled={testing} variant="secondary">
          {testing ? 'Čekáme na platbu…' : 'Označit testovací platbu'}
        </GovButton>
        {tested && (
          <span className="inline-flex items-center gap-2 text-body text-success">
            <CheckIcon size={18} /> Testovací platba 1 Kč přijata.
          </span>
        )}
      </Card>
    </>
  )
}

function Segment({
  label,
  value,
  onChange,
  w,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  w: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption text-ink-soft">{label}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        className={`gov-focus h-12 ${w} rounded-btn border border-line bg-paper px-2 text-center text-body text-ink`}
      />
    </div>
  )
}
