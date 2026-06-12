interface Props {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
}

// − 1 + control with 48px touch targets.
export function Stepper({ value, onChange, min = 0, max = 99, label }: Props) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label={`Ubrat — ${label}`}
        className="gov-focus flex h-12 w-12 items-center justify-center rounded-btn border border-line bg-paper text-h2 text-gov-blue transition-colors hover:bg-gov-blue-tint disabled:pointer-events-none disabled:opacity-40"
      >
        −
      </button>
      <span
        className="tnum w-8 text-center text-h2 font-semibold text-ink"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label={`Přidat — ${label}`}
        className="gov-focus flex h-12 w-12 items-center justify-center rounded-btn border border-line bg-paper text-h2 text-gov-blue transition-colors hover:bg-gov-blue-tint disabled:pointer-events-none disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}
