import type { ReactNode } from 'react'
import { useNavigate } from '../lib/router'
import { ArrowLeftIcon } from './Icons'

interface Props {
  title: string
  subtitle?: string
  back?: string // hash to navigate back to
  children: ReactNode
  // Sticky bottom bar (live total + primary action), pinned within the column.
  footer?: ReactNode
}

// Single-column citizen layout, max 480px, centred — a municipal form, not a webpage.
export function FormShell({ title, subtitle, back, children, footer }: Props) {
  const navigate = useNavigate()
  return (
    <div className="mx-auto w-full max-w-form px-4 pb-32 pt-6">
      {back && (
        <button
          type="button"
          onClick={() => navigate(back)}
          className="gov-focus mb-4 inline-flex items-center gap-2 rounded text-label font-medium text-gov-blue hover:underline"
        >
          <ArrowLeftIcon size={18} />
          Zpět
        </button>
      )}
      <h1 className="text-display text-ink">{title}</h1>
      {subtitle && <p className="mt-2 text-body text-ink-soft">{subtitle}</p>}
      <div className="mt-6 flex flex-col gap-6">{children}</div>
      {footer && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper">
          <div className="mx-auto w-full max-w-form px-4 py-4">{footer}</div>
        </div>
      )}
    </div>
  )
}
