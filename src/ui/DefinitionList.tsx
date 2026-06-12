interface Props {
  items: { label: string; value: string }[]
}

export function DefinitionList({ items }: Props) {
  return (
    <dl className="flex flex-col">
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`flex items-start justify-between gap-4 py-2 ${
            i > 0 ? 'border-t border-line' : ''
          }`}
        >
          <dt className="text-label text-ink-soft">{it.label}</dt>
          <dd className="text-body text-ink text-right">{it.value}</dd>
        </div>
      ))}
    </dl>
  )
}
