import { useState } from 'react'
import { useTopData } from '../hooks/useTopData'
import type { TimeRange } from '../types'
import ArtistList from './ArtistList'
import TimeRangeToggle from './TimeRangeToggle'
import TrackList from './TrackList'
import { averageReleaseYear, byDecade, diversityLabel, genreCounts, genreDiversity, loyalty } from '../lib/stats'
import StatCard from './StatCard'
import { availableStats } from '../lib/stats'


export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>('medium_term')
  const { artists, tracks, status, error, retry } = useTopData(range)

  if (status === 'done') {
    console.log('diversity', genreDiversity(artists))
    console.log('label', diversityLabel(genreDiversity(artists)))
    console.log('music age', averageReleaseYear(tracks))
    console.log('decades', byDecade(tracks))
    console.log('loyalty', loyalty(tracks))
    console.log('genres', genreCounts(artists))
  }

  return (
    <div>
      <TimeRangeToggle value={range} onChange={setRange} />

      {status === 'loading' && <p>Loading...</p>}

      {status === 'error' && (
        <div>
          <p role="alert">{error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}

      {status === 'done' && (
        <div>
            {availableStats(false).map(function (stat) {
            const result = stat.compute({ artists, tracks, olderArtists: [] })
            return (
                <StatCard
                key={stat.id}
                label={stat.label}
                value={result.value}
                caption={result.caption}
                />
            )
            })}
          <ArtistList artists={artists} />
          <TrackList tracks={tracks} />
        </div>
      )}
    </div>
  )
}