interface Props {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="gov-focus relative inline-flex h-6 w-12 shrink-0 items-center rounded-full border transition-colors"
      style={{
        backgroundColor: checked ? 'var(--gov-blue)' : 'var(--line)',
        borderColor: checked ? 'var(--gov-blue)' : 'var(--line)',
      }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
        style={{ transform: checked ? 'translateX(26px)' : 'translateX(4px)' }}
      />
    </button>
  )
}
