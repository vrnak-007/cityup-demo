interface Props {
  value: number // 0–5
  onChange?: (v: number) => void
  size?: number
  readOnly?: boolean
}

function Star({ filled, size }: { filled: boolean; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'var(--warning)' : 'none'}
      stroke={filled ? 'var(--warning)' : 'var(--line)'}
      strokeWidth={1.75}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9 6.8 19l1-5.8L3.6 9.1l5.8-.8z" />
    </svg>
  )
}

export function StarRating({ value, onChange, size = 28, readOnly }: Props) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Hodnocení">
      {[1, 2, 3, 4, 5].map((n) =>
        readOnly ? (
          <Star key={n} filled={n <= value} size={size} />
        ) : (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            aria-label={`${n} z 5 hvězd`}
            className="gov-focus rounded p-1 transition-transform hover:scale-110"
          >
            <Star filled={n <= value} size={size} />
          </button>
        ),
      )}
    </div>
  )
}
