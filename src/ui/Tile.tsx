import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  title: string
  description: string
  onClick: () => void
}

export function Tile({ icon, title, description, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="gov-focus flex flex-col gap-2 rounded-card border border-line bg-paper p-4 text-left transition-colors hover:border-gov-blue hover:bg-gov-blue-tint"
    >
      <span className="text-gov-blue">{icon}</span>
      <span className="text-body font-medium text-ink">{title}</span>
      <span className="text-caption text-ink-soft">{description}</span>
    </button>
  )
}
