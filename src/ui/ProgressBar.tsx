interface Props {
  value: number // 0–100
}

export function ProgressBar({ value }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div
      className="h-4 w-full overflow-hidden rounded-full bg-line"
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: 'var(--gov-blue)' }}
      />
    </div>
  )
}
