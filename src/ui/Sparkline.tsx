interface Props {
  values: number[]
  width?: number
  height?: number
}

// Tiny inline trend line — no axes, no library overhead.
export function Sparkline({ values, width = 120, height = 36 }: Props) {
  if (values.length < 2) return null
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (values.length - 1)
  const pts = values.map((v, i) => {
    const x = i * stepX
    const y = height - 2 - ((v - min) / span) * (height - 4)
    return [x, y] as const
  })
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const [lastX, lastY] = pts[pts.length - 1]
  return (
    <svg width={width} height={height} aria-hidden="true">
      <path d={d} fill="none" stroke="var(--gov-blue)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r={2.5} fill="var(--gov-blue)" />
    </svg>
  )
}
