import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { byDecade } from '../lib/stats'
import type { Track } from '../types'

interface Props {
  tracks: Track[]
}

// column chart of how many of your top tracks came from each decade
export default function DecadeChart({ tracks }: Props) {
  // already oldest first, like { decade: '1990s', count: 7 }
  const data = byDecade(tracks)

  // nothing to draw (no valid release dates)
  if (data.length === 0) {
    return <p>No release date data yet.</p>
  }

  return (
    <div>
      <h2>Your top 50 tracks by decade</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="decade" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count">
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}