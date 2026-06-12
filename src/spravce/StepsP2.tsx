import { useState } from 'react'
import { useTenant, type Pozvanka } from './tenant'
import { Card } from '../ui/Card'
import { GovButton } from '../ui/GovButton'
import { GovInput, GovTextarea } from '../ui/GovInput'
import { InfoBar } from '../ui/InfoBar'
import { Checkbox } from '../ui/Checkbox'
import { QrCode } from '../ui/QrCode'
import { CheckIcon } from '../ui/Icons'

const SPISOVKY = [
  { v: '', l: 'Vyberte spisovou službu…' },
  { v: 'ginis', l: 'Gordic GINIS' },
  { v: 'munis', l: 'Munis (Triada)' },
  { v: 'vera', l: 'VERA Radnice' },
  { v: 'jina', l: 'Jiná / nevím' },
]

// ---- Krok 6: Doručování podání ----
function Sipka() {
  return (
    <div className="flex justify-center py-1 text-ink-soft" aria-hidden="true">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M6 13l6 6 6-6" />
      </svg>
    </div>
  )
}

export function Step6() {
  const { cfg, set } = useTenant()
  return (
    <div className="flex flex-col">
      {/* ① Spisová služba */}
      <Card className="flex flex-col gap-2">
        <span className="text-body font-medium text-ink">1 · Spisová služba</span>
        <select
          value={cfg.spisovka}
          onChange={(e) => set('spisovka', e.target.value)}
          className="gov-focus h-12 w-full rounded-btn border border-line bg-paper px-4 text-body text-ink"
        >
          {SPISOVKY.map((s) => (
            <option key={s.v} value={s.v}>
              {s.l}
            </option>
          ))}
        </select>
        <div className="mt-2 flex items-start gap-2 rounded-btn border border-line px-4 py-2" style={{ background: 'rgba(185,94,0,0.08)' }}>
          <span className="mt-[2px] h-2 w-2 shrink-0 rounded-full" style={{ background: 'var(--warning)' }} />
          <p className="text-caption text-ink">
            Připravujeme — automatické předání do spisové služby vyžaduje napojení
            vaší spisovky (fáze 3). Portál mezitím funguje přes datovou schránku.
          </p>
        </div>
      </Card>

      <Sipka />

      {/* ② Datová schránka */}
      <Card className="flex flex-col gap-2">
        <span className="text-body font-medium text-ink">2 · Datová schránka</span>
        <p className="tnum text-caption text-ink-soft">
          ID schránky: {cfg.isds || '—'} (z kroku 1)
        </p>
        <GovButton
          variant="secondary"
          onClick={() => set('isdsTested', true)}
          className="self-start"
        >
          {cfg.isdsTested ? 'Doručení ověřeno' : 'Otestovat doručení'}
        </GovButton>
        {cfg.isdsTested && (
          <span className="inline-flex items-center gap-2 text-caption text-success">
            <CheckIcon size={16} /> Testovací zpráva doručena do datové schránky.
          </span>
        )}
      </Card>

      <Sipka />

      {/* ③ Manuální fronta */}
      <Card tint className="flex flex-col gap-2">
        <span className="text-body font-medium text-ink">
          3 · Manuální fronta <span className="text-success">(vždy aktivní)</span>
        </span>
        <p className="text-caption text-ink-soft">
          Záchranná síť: pokud selže předání, podání zůstane ve frontě úředníka.
          Nic se neztratí.
        </p>
      </Card>
    </div>
  )
}

// ---- Krok 7: Úředníci ----
const TOTP_URI =
  'otpauth://totp/CityUp:novakova@hvozdnice.cz?secret=JBSWY3DPEHPK3PXP&issuer=CityUp'

export function Step7() {
  const { cfg, set } = useTenant()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Pozvanka['role']>('Úředník')
  const [agendy, setAgendy] = useState('')
  const [sent, setSent] = useState<string | null>(null)

  const pridat = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return
    set('pozvanky', [...cfg.pozvanky, { email, role, agendy: agendy || 'Vše' }])
    setSent(email)
    setEmail('')
    setAgendy('')
  }

  return (
    <>
      <div className="overflow-hidden rounded-card border border-line">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-label text-ink-soft">
              <th className="px-4 py-2 font-medium">E-mail</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">Agendy</th>
            </tr>
          </thead>
          <tbody>
            {cfg.pozvanky.map((p, i) => (
              <tr key={i} className={`border-b border-line last:border-0 ${i % 2 ? 'bg-canvas' : 'bg-paper'}`}>
                <td className="px-4 py-2 text-body text-ink">{p.email}</td>
                <td className="px-4 py-2 text-body text-ink">{p.role}</td>
                <td className="px-4 py-2 text-caption text-ink-soft">{p.agendy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="flex flex-col gap-4">
        <span className="text-label font-medium text-ink">Pozvat dalšího</span>
        <GovInput label="E-mail úředníka" type="email" placeholder="jmeno@hvozdnice.cz" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="flex flex-col gap-2">
          <label className="text-label font-medium text-ink">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as Pozvanka['role'])} className="gov-focus h-12 w-full rounded-btn border border-line bg-paper px-4 text-body text-ink">
            <option>Úředník</option>
            <option>Správce</option>
          </select>
        </div>
        <GovInput label="Agendy (volitelné)" placeholder="např. Psi, Odpad" value={agendy} onChange={(e) => setAgendy(e.target.value)} />
        <GovButton onClick={pridat} className="self-start">Odeslat pozvánku</GovButton>
        {sent && (
          <span className="inline-flex items-center gap-2 text-caption text-success">
            <CheckIcon size={16} /> Pozvánka odeslána na {sent}.
          </span>
        )}
      </Card>

      <Card tint className="flex items-center gap-4">
        <div className="rounded-btn border border-line bg-white p-2">
          <QrCode value={TOTP_URI} size={96} />
        </div>
        <div className="flex flex-col">
          <span className="text-body font-medium text-ink">
            Každý účet vyžaduje dvoufázové ověření (TOTP)
          </span>
          <span className="text-caption text-ink-soft">
            Úředník si QR načte do aplikace autentizátoru (Google Authenticator,
            Authy…) při prvním přihlášení.
          </span>
        </div>
      </Card>
    </>
  )
}

// ---- Krok 8: Texty a oznámení ----
export function Step8() {
  const { cfg, set } = useTenant()
  return (
    <>
      <GovTextarea
        label="Uvítací text portálu"
        value={cfg.uvitaci}
        onChange={(e) => set('uvitaci', e.target.value)}
      />
      <GovInput
        label="Patička s kontakty"
        value={cfg.paticka}
        onChange={(e) => set('paticka', e.target.value)}
      />
      <Card className="flex flex-col gap-4">
        <Checkbox
          checked={cfg.generovatOznameni}
          onChange={(v) => set('generovatOznameni', v)}
          label="Po spuštění vygenerovat oznámení pro web obce a zpravodaj"
          description="Připravíme hotový text, který jen zveřejníte."
        />
        {cfg.generovatOznameni && (
          <div className="rounded-btn bg-gov-blue-tint p-4">
            <span className="text-caption font-medium text-ink-soft">
              Náhled oznámení občanům
            </span>
            <p className="mt-2 text-body text-ink">
              Obec {cfg.nazev || 'Hvozdnice'} spustila online portál. Poplatky a
              podání nyní vyřídíte z domova na adrese {cfg.subdomena || 'obec'}
              .cityup.cz — bez fronty a papírů. Přihlášení přes Identitu občana.
            </p>
          </div>
        )}
      </Card>
    </>
  )
}

// ---- Krok 9: Kontrola připravenosti ----
function radek(ok: boolean, label: string, note?: string) {
  return { ok, label, note }
}

export function Step9({ onLaunch }: { onLaunch: () => void }) {
  const { cfg } = useTenant()
  const [confirm, setConfirm] = useState(false)

  const checklist = [
    radek(cfg.aresLoaded, 'Obec'),
    radek(Object.values(cfg.agendy).some(Boolean), 'Agendy'),
    radek(cfg.pesPrvni > 0, 'Sazby'),
    radek(cfg.ucet.trim().length > 0, 'Účet a QR test'),
    radek(cfg.isdsTested, 'Doručování: datová schránka (ISDS)'),
    { ok: null as boolean | null, label: 'Doručování: spisová služba', note: 'Lze spustit s ISDS, doplníte ve fázi 3' },
    radek(cfg.pozvanky.length > 0, 'Úředníci pozváni'),
    radek(cfg.uvitaci.trim().length > 0, 'Texty'),
  ]

  return (
    <>
      <Card className="!p-0">
        <ul>
          {checklist.map((c, i) => (
            <li key={c.label} className={`flex items-center gap-4 px-4 py-4 ${i > 0 ? 'border-t border-line' : ''}`}>
              {c.ok === null ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-line text-ink-soft">–</span>
              ) : (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-white">
                  <CheckIcon size={14} />
                </span>
              )}
              <span className="flex flex-1 flex-col">
                <span className="text-body text-ink">{c.label}</span>
                {c.note && <span className="text-caption text-ink-soft">{c.note}</span>}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <InfoBar>
        Spisovou službu lze doplnit později — portál spustíte s doručováním přes
        datovou schránku.
      </InfoBar>

      <GovButton onClick={() => setConfirm(true)} fullWidth className="!h-14 text-h2">
        Spustit portál pro občany
      </GovButton>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(38,38,38,0.45)' }} onClick={() => setConfirm(false)}>
          <div className="gov-fade w-full max-w-form rounded-card border border-line bg-paper" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="border-b border-line px-4 py-4">
              <h2 className="text-h2 text-ink">Spustit portál?</h2>
            </div>
            <div className="px-4 py-4 text-body text-ink">
              <p>Portál obce {cfg.nazev || 'Hvozdnice'} se zpřístupní občanům na adrese{' '}
                <strong>{cfg.subdomena || 'obec'}.cityup.cz</strong>.</p>
              <ul className="mt-4 flex flex-col gap-2 text-caption text-ink-soft">
                <li>· {Object.values(cfg.agendy).filter(Boolean).length} aktivních agend</li>
                <li>· doručování přes datovou schránku</li>
                <li>· {cfg.pozvanky.length} pozvaných úředníků</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-4 py-4">
              <GovButton variant="plain" onClick={() => setConfirm(false)}>Zrušit</GovButton>
              <GovButton onClick={() => { setConfirm(false); onLaunch() }}>Spustit portál</GovButton>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
