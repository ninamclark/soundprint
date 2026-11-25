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
      <h2>Top genres</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="genre" width={110} />
          <Tooltip />
          <Bar dataKey="count">
            <LabelList dataKey="count" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}