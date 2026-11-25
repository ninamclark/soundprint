import type { Personality } from '../lib/personalities'

interface Props {
  personality: Personality
}

// shows your personality label, a one-line description, and why you got it
export default function PersonalityCard({ personality }: Props) {
  return (
    <div>
      <h2 className="text-5xl font-semibold tracking-tight text-[var(--accent)]">{personality.label}</h2>
      <p className="mt-3 text-xl text-stone-300">{personality.description}</p>
      {personality.reasons.length > 0 && (
        <ul className = "mt-4 space-y-1 text-sm text-stone-400">
          {personality.reasons.map(function (reason) {
            return <li key={reason}>{reason}</li>
          })}
        </ul>
      )}
    </div>
  )
}