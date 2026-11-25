import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { genreCounts, type GenreCount } from '../lib/stats'
import type { Artist } from '../types'

interface Props {
  artists: Artist[]
}

const MAX_BARS = 8

// bar chart of your most common genres across your top artists
export default function GenreChart({ artists }: Props) {
  const counts = genreCounts(artists)
  const data: GenreCount[] = []
  let keep = MAX_BARS - 1
    if (counts.length <= MAX_BARS) {
    keep = counts.length
    }
  for (let i = 0; i < counts.length; i++) {
    if (i < keep) {
        data.push(counts[i])
    } 
}
  // nothing to draw (no genres came back)
  if (counts.length === 0) {
    return <p>No genre data yet.</p>
  }

  return (
    <div>
      <h2 className = "text-2xl font-semibold tracking-tight">Top genres</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ right: 24 }}>
            <XAxis type="number" allowDecimals={false} hide />
            <YAxis
            type="category"
            dataKey="genre"
            width={110}
            tick={{ fill: '#a8a29e', fontSize: 14 }}
            axisLine={false}
            tickLine={false}
            />
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
            <Bar dataKey="count" fill="#8fbf9f" radius={[0, 6, 6, 0]}>
            <LabelList dataKey="count" position="right" fill="#f5f5f4" fontSize={14} />
            </Bar>
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}