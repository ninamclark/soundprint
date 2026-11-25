import type { TimeRange } from '../types'

interface Props {
  value: TimeRange
  onChange: (range: TimeRange) => void
}

const options: { range: TimeRange; label: string }[] = [
  { range: 'short_term', label: 'Last 4 weeks' },
  { range: 'medium_term', label: 'Last 6 months' },
  { range: 'long_term', label: 'Last 12 months' },
]

export default function TimeRangeToggle({ value, onChange }: Props) {
  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.range}
          aria-pressed={value === option.range}
          onClick={() => onChange(option.range)}
          className="rounded-full border border-white/20 px-4 py-1 text-sm aria-pressed:border-transparent aria-pressed:bg-[var(--accent)] aria-pressed:text-black"
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}