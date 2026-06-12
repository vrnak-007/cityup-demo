import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'plain'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gov-blue text-white border border-gov-blue hover:bg-gov-blue-dark hover:border-gov-blue-dark active:translate-y-[1px]',
  secondary:
    'bg-paper text-gov-blue border border-gov-blue hover:bg-gov-blue-tint active:translate-y-[1px]',
  plain:
    'bg-transparent text-gov-blue border border-transparent hover:underline px-0',
}

export function GovButton({
  variant = 'primary',
  fullWidth,
  className = '',
  children,
  disabled,
  ...rest
}: Props) {
  return (
    <button
      className={[
        'gov-focus inline-flex h-12 items-center justify-center gap-2 rounded-btn px-4 text-label font-medium transition-colors',
        variants[variant],
        fullWidth ? 'w-full' : '',
        disabled ? 'pointer-events-none opacity-40' : '',
        className,
      ].join(' ')}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  )
}
