import { ShieldIcon } from './Icons'

interface Props {
  label: string
  value: string
}

// Non-editable field on a tinted block — the signature element of the demo.
// Communicates „this came from your verified identity, you don't retype it".
export function VerifiedField({ label, value }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-label font-medium text-ink">{label}</span>
      <div className="flex items-start gap-2 rounded-btn border border-gov-blue/25 bg-gov-blue-tint px-4 py-2">
        <ShieldIcon
          className="mt-[2px] shrink-0 text-gov-blue"
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-body text-ink">{value}</span>
          <span className="text-caption text-ink-soft">
            Ověřeno Identitou občana
          </span>
        </div>
      </div>
    </div>
  )
}
