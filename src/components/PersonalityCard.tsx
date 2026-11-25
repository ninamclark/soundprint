import type { Personality } from '../lib/personalities'

interface Props {
  personality: Personality
}

// shows your personality label, a one-line description, and why you got it
export default function PersonalityCard({ personality }: Props) {
  return (
    <div>
      <h2>{personality.label}</h2>
      <p>{personality.description}</p>
      {personality.reasons.length > 0 && (
        <ul>
          {personality.reasons.map(function (reason) {
            return <li key={reason}>{reason}</li>
          })}
        </ul>
      )}
    </div>
  )
}