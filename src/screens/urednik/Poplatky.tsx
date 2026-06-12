import { useMemo, useState } from 'react'
import { useApp } from '../../lib/store'
import { OfficerNav } from '../../ui/OfficerNav'
import { Card } from '../../ui/Card'
import { GovButton } from '../../ui/GovButton'
import { Modal } from '../../ui/Modal'
import { CheckIcon, QrIcon } from '../../ui/Icons'
import { formatKc, formatNumber } from '../../lib/format'

export function Poplatky() {
  const { poplatky } = useApp()

  const debtors = useMemo(
    () => poplatky.filter((p) => !p.zaplaceno),
    [poplatky],
  )

  const predpisCelkem = poplatky.reduce((s, p) => s + p.predpis, 0)
  const vybrano = poplatky
    .filter((p) => p.zaplaceno)
    .reduce((s, p) => s + p.predpis, 0)
  const procento = Math.round((vybrano / predpisCelkem) * 100)
  const dluznaCastka = debtors.reduce((s, p) => s + p.predpis, 0)

  // All debtors selected by default.
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(debtors.map((d) => d.id)),
  )
  const [confirm, setConfirm] = useState(false)
  const [sent, setSent] = useState<{ email: number; pdf: number } | null>(null)

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const selectedDebtors = debtors.filter((d) => selected.has(d.id))
  const emailCount = selectedDebtors.filter((d) => d.email).length
  const pdfCount = selectedDebtors.filter((d) => !d.email).length

  const odeslat = () => {
    setSent({ email: emailCount, pdf: pdfCount })
    setConfirm(false)
  }

  return (
    <div className="mx-auto w-full max-w-app px-4 pb-12 pt-6">
      <OfficerNav />
      <h1 className="text-display text-ink">Výběr poplatků 2026</h1>
      <p className="mt-2 text-body text-ink-soft">Psi a komunální odpad</p>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-col gap-2">
          <span className="text-caption text-ink-soft">Předpis 2026 celkem</span>
          <span className="tnum text-display text-ink">{formatKc(predpisCelkem)}</span>
          <span className="text-caption text-ink-soft">
            {formatNumber(poplatky.length)} poplatníků
          </span>
        </Card>
        <Card className="flex flex-col gap-2">
          <span className="text-caption text-ink-soft">Vybráno</span>
          <span className="tnum text-display text-ink">{formatKc(vybrano)}</span>
          <span className="text-caption text-success">{procento} % předpisu</span>
        </Card>
        <Card className="flex flex-col gap-2">
          <span className="text-caption text-ink-soft">Dluží</span>
          <span className="tnum text-display text-ink">
            {formatNumber(debtors.length)}
          </span>
          <span className="tnum text-caption text-error">
            {formatKc(dluznaCastka)} po splatnosti
          </span>
        </Card>
      </div>

      {/* Action bar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-h2 text-ink">Dlužníci</h2>
        <GovButton
          onClick={() => setConfirm(true)}
          disabled={selected.size === 0}
        >
          <QrIcon size={18} />
          Odeslat upomínku s QR platbou ({selected.size})
        </GovButton>
      </div>

      <div className="mt-4 overflow-x-auto rounded-card border border-line bg-paper">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line text-label text-ink-soft">
              <th className="w-12 px-4 py-2"></th>
              <th className="px-4 py-2 font-medium">Jméno</th>
              <th className="px-4 py-2 font-medium">Agenda</th>
              <th className="px-4 py-2 text-right font-medium">Předpis</th>
              <th className="px-4 py-2 font-medium">Po splatnosti</th>
              <th className="px-4 py-2 font-medium">Kontakt</th>
            </tr>
          </thead>
          <tbody>
            {debtors.map((d, i) => (
              <tr
                key={d.id}
                className={`border-b border-line last:border-0 ${
                  i % 2 === 1 ? 'bg-canvas' : 'bg-paper'
                }`}
              >
                <td className="px-4 py-2">
                  <button
                    role="checkbox"
                    aria-checked={selected.has(d.id)}
                    aria-label={`Vybrat ${d.jmeno}`}
                    onClick={() => toggle(d.id)}
                    className={[
                      'gov-focus flex h-6 w-6 items-center justify-center rounded border transition-colors',
                      selected.has(d.id)
                        ? 'border-gov-blue bg-gov-blue text-white'
                        : 'border-line bg-paper text-transparent',
                    ].join(' ')}
                  >
                    <CheckIcon size={14} />
                  </button>
                </td>
                <td className="px-4 py-2 text-body text-ink">{d.jmeno}</td>
                <td className="px-4 py-2 text-body text-ink">{d.agenda}</td>
                <td className="tnum px-4 py-2 text-right text-body text-ink">
                  {formatKc(d.predpis)}
                </td>
                <td className="tnum px-4 py-2 text-body text-error">
                  {d.poSplatnostiDni} dní
                </td>
                <td className="px-4 py-2 text-caption text-ink-soft">
                  {d.email ?? 'bez e-mailu (PDF)'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirm && (
        <Modal
          title="Odeslat upomínky?"
          onClose={() => setConfirm(false)}
          footer={
            <>
              <GovButton variant="plain" onClick={() => setConfirm(false)}>
                Zrušit
              </GovButton>
              <GovButton onClick={odeslat}>Odeslat {selected.size} upomínek</GovButton>
            </>
          }
        >
          <p className="text-body text-ink">
            Vyberete {selected.size} dlužníkům upomínku s předvyplněnou QR platbou.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-body text-ink">
            <li className="tnum">
              · {emailCount} e-mailem
            </li>
            <li className="tnum">
              · {pdfCount} bez e-mailu — vytištěno do PDF k doručení poštou
            </li>
          </ul>
        </Modal>
      )}

      {sent && (
        <Modal
          title="Upomínky odeslány"
          onClose={() => setSent(null)}
          footer={
            <GovButton onClick={() => setSent(null)}>Zavřít</GovButton>
          }
        >
          <div className="flex items-start gap-4">
            <span className="mt-[2px] flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <CheckIcon size={24} />
            </span>
            <p className="tnum text-body text-ink">
              Odesláno {sent.email} upomínek e-mailem, {sent.pdf} občanů bez
              e-mailu vytištěno do PDF.
            </p>
          </div>
        </Modal>
      )}
    </div>
  )
}
