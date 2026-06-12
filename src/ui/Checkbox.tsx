import type { ReactNode } from 'react'
import { CheckIcon } from './Icons'

interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
  description?: ReactNode
}

export function Checkbox({ checked, onChange, label, description }: Props) {
  return (
    <label className="flex cursor-pointer items-start gap-4">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          'gov-focus mt-[2px] flex h-6 w-6 shrink-0 items-center justify-center rounded border transition-colors',
          checked
            ? 'border-gov-blue bg-gov-blue text-white'
            : 'border-line bg-paper text-transparent',
        ].join(' ')}
      >
        <CheckIcon size={14} />
      </button>
      <span className="flex flex-col">
        <span className="text-body text-ink">{label}</span>
        {description && (
          <span className="text-caption text-ink-soft">{description}</span>
        )}
      </span>
    </label>
  )
}
