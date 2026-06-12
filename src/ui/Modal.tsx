import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
}

export function Modal({ title, children, onClose, footer }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(38,38,38,0.45)' }}
      onClick={onClose}
    >
      <div
        className="gov-fade w-full max-w-form rounded-card border border-line bg-paper"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="border-b border-line px-4 py-4">
          <h2 className="text-h2 text-ink">{title}</h2>
        </div>
        <div className="px-4 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-line px-4 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
