import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  error?: string
  hint?: string
}

const fieldBase =
  'gov-focus w-full rounded-btn border bg-paper px-4 text-body text-ink placeholder:text-ink-soft/60 transition-colors'

export function GovInput({
  label,
  error,
  hint,
  className = '',
  id,
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const inputId = id ?? `f-${label}`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-label font-medium text-ink">
        {label}
      </label>
      <input
        id={inputId}
        className={[
          fieldBase,
          'h-12',
          error
            ? 'border-error focus-visible:border-error'
            : 'border-line focus-visible:border-gov-blue',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="text-caption text-error">{error}</p>
      ) : hint ? (
        <p className="text-caption text-ink-soft">{hint}</p>
      ) : null}
    </div>
  )
}

export function GovTextarea({
  label,
  error,
  hint,
  className = '',
  id,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const inputId = id ?? `f-${label}`
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-label font-medium text-ink">
        {label}
      </label>
      <textarea
        id={inputId}
        className={[
          fieldBase,
          'min-h-[120px] py-2 leading-6',
          error
            ? 'border-error focus-visible:border-error'
            : 'border-line focus-visible:border-gov-blue',
          className,
        ].join(' ')}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="text-caption text-error">{error}</p>
      ) : hint ? (
        <p className="text-caption text-ink-soft">{hint}</p>
      ) : null}
    </div>
  )
}
