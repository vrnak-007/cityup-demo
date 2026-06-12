import type { TimelineStep } from '../lib/types'
import { CheckIcon } from './Icons'

// Vertical timeline. Filled circle = done (with check), ring = pending,
// hollow grey = future. The „Doručeno úřadu" step fades in when it flips to done.
export function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        const isFuture = step.state === 'future'
        return (
          <li key={step.label} className="flex gap-4">
            <div className="flex flex-col items-center">
              <Dot state={step.state} />
              {!last && (
                <span
                  className="w-[2px] flex-1"
                  style={{
                    background: isFuture ? 'var(--line)' : 'var(--gov-blue)',
                    minHeight: 24,
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
            <div className={`pb-6 ${last ? 'pb-0' : ''}`}>
              <p
                className={`text-body ${
                  isFuture ? 'text-ink-soft' : 'font-medium text-ink'
                } ${step.state === 'done' ? 'gov-fade' : ''}`}
              >
                {step.label}
              </p>
              {step.time && (
                <p className="tnum text-caption text-ink-soft">{step.time}</p>
              )}
              {step.note && (
                <p className="text-caption text-ink-soft">{step.note}</p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Dot({ state }: { state: TimelineStep['state'] }) {
  if (state === 'done') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gov-blue text-white">
        <CheckIcon size={14} />
      </span>
    )
  }
  if (state === 'pending') {
    return (
      <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gov-blue bg-paper">
        <span className="h-2 w-2 rounded-full bg-gov-blue" />
      </span>
    )
  }
  return (
    <span className="h-6 w-6 rounded-full border-2 border-line bg-paper" />
  )
}
