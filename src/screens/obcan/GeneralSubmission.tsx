import { useState } from 'react'
import { useNavigate } from '../../lib/router'
import { useApp } from '../../lib/store'
import { FormShell } from '../../ui/FormShell'
import { VerifiedField } from '../../ui/VerifiedField'
import { GovTextarea } from '../../ui/GovInput'
import { GovButton } from '../../ui/GovButton'
import { PaperclipIcon } from '../../ui/Icons'

const DEPARTMENTS = [
  'Životní prostředí',
  'Stavební úřad',
  'Sociální odbor',
  'Matrika',
  'Ostatní',
]

export function GeneralSubmission() {
  const { user, setDraft } = useApp()
  const navigate = useNavigate()

  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [text, setText] = useState('')
  const [file, setFile] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)

  const valid = text.trim().length > 5
  const submit = () => {
    setTouched(true)
    if (!valid) return
    setDraft({
      kind: 'obecne',
      title: 'Obecné podání',
      amount: 0,
      vs: '',
      spdMessage: '',
      backTo: 'obcan/podani',
      requiresPayment: false,
      detail: [
        { label: 'Podatel', value: user?.name ?? 'Jan Novák' },
        { label: 'Odbor', value: department },
        { label: 'Předmět', value: text.trim() },
        { label: 'Příloha', value: file ? '1 soubor' : '—' },
      ],
    })
    navigate('obcan/souhrn')
  }

  return (
    <FormShell
      title="Obecné podání"
      subtitle="Žádost nebo podnět na úřad"
      back="obcan/uvod"
      footer={
        <GovButton onClick={submit} disabled={!valid} fullWidth>
          Pokračovat
        </GovButton>
      }
    >
      <VerifiedField label="Podatel" value={user?.name ?? 'Jan Novák'} />

      <div className="flex flex-col gap-2">
        <label htmlFor="odbor" className="text-label font-medium text-ink">
          Odbor
        </label>
        <select
          id="odbor"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="gov-focus h-12 w-full rounded-btn border border-line bg-paper px-4 text-body text-ink"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      <GovTextarea
        label="Předmět podání"
        placeholder="Popište, čeho se podání týká…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        error={touched && !valid ? 'Doplňte předmět podání.' : undefined}
      />

      <div className="flex flex-col gap-2">
        <span className="text-label font-medium text-ink">Příloha (volitelné)</span>
        <label className="gov-focus flex cursor-pointer items-center gap-4 rounded-btn border border-dashed border-line bg-paper px-4 py-4 hover:bg-gov-blue-tint">
          <span className="text-gov-blue">
            <PaperclipIcon />
          </span>
          <span className="text-body text-ink-soft">
            {file ? 'Příloha přidána · změnit' : 'Přidat přílohu'}
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setFile(f.name)
            }}
          />
        </label>
        {file && <p className="text-caption text-ink-soft">{file}</p>}
      </div>
    </FormShell>
  )
}
