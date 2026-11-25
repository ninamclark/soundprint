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
    <div>
      {options.map((option) => (
        <button
          key={option.range}
          aria-pressed={value === option.range}
          onClick={() => onChange(option.range)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}