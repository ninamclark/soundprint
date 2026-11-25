import { useState } from 'react'
import { useTopData } from '../hooks/useTopData'
import type { TimeRange } from '../types'
import ArtistList from './ArtistList'
import TimeRangeToggle from './TimeRangeToggle'
import TrackList from './TrackList'
import { averageReleaseYear, byDecade, diversityLabel, genreCounts, genreDiversity, loyalty } from '../lib/stats'
import StatCard from './StatCard'
import { availableStats } from '../lib/stats'
import GenreChart from './genreChart'
import DecadeChart from './decadeChart'
import PersonalityCard from './PersonalityCard'
import { getPersonality } from '../lib/personalities'
import ShareCard from './ShareCard'

const RANGE_LABELS: Record<TimeRange, string> = {
    short_term: 'Last 4 weeks',
    medium_term: 'Last 6 months',
    long_term: 'Last 12 months',
  }

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>('medium_term')
  const { artists, tracks, status, error, retry } = useTopData(range)
  const personality = getPersonality({
    diversity: genreDiversity(artists),
    averageYear: averageReleaseYear(tracks),
    loyalty: loyalty(tracks),
    decadeCount: byDecade(tracks).length,
    artistCount: artists.length,
  })

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
        <div className="mt-8 space-y-10">
            <PersonalityCard
                personality={getPersonality({
                diversity: genreDiversity(artists),
                averageYear: averageReleaseYear(tracks),
                loyalty: loyalty(tracks),
                decadeCount: byDecade(tracks).length,
                artistCount: artists.length,
                })}
            />
            <div className="grid grid-cols-1 gap-8 border-y border-white/10 py-8 sm:grid-cols-3">
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
            </div>
          <ArtistList artists={artists} />
          <TrackList tracks={tracks} />
          <GenreChart artists={artists} />
          <DecadeChart tracks={tracks} />
          <ShareCard personality={personality} artists={artists} 
          tracks={tracks} rangeLabel={RANGE_LABELS[range]} />
        </div>
      )}
    </div>
  )
}