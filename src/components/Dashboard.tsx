import { useState } from 'react'
import { useTopData } from '../hooks/useTopData'
import type { TimeRange } from '../types'
import ArtistList from './ArtistList'
import TimeRangeToggle from './TimeRangeToggle'
import TrackList from './TrackList'

export default function Dashboard() {
  const [range, setRange] = useState<TimeRange>('medium_term')
  const { artists, tracks, status, error, retry } = useTopData(range)

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
          <ArtistList artists={artists} />
          <TrackList tracks={tracks} />
        </div>
      )}
    </div>
  )
}