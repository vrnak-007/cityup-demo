import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tint?: boolean
}

export function Card({ children, tint, className = '', ...rest }: Props) {
  return (
    <div
      className={[
        'rounded-card border border-line p-4',
        tint ? 'bg-gov-blue-tint' : 'bg-paper',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  )
}
