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
      <h2 className="text-2xl font-semibold tracking-tight">Your top 50 tracks by decade</h2>
      <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
        <XAxis
        dataKey="decade"
        tick={{ fill: '#a8a29e', fontSize: 14 }}
        axisLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
        tickLine={false}
        />
        <YAxis hide />
        <Tooltip
        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
        contentStyle={{
            background: '#1c1c1f',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
        }}
        labelStyle={{ color: '#f5f5f4' }}
        itemStyle={{ color: '#f5f5f4' }}
        />
        <Bar dataKey="count" fill="#8fbf9f" radius={[6, 6, 0, 0]} barSize={60}>
        <LabelList dataKey="count" position="top" fill="#f5f5f4" fontSize={14} />
        </Bar>
    </BarChart>
    </ResponsiveContainer>
    </div>
  )
}