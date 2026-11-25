import { useEffect, useState } from 'react'
import { getTopArtists, getTopTracks } from '../api/spotify'
import type { Artist, TimeRange, Track } from '../types'
import { addGenres } from '../api/lastfm'

type Status = 'loading' | 'done' | 'error'

// loads top artists and tracks whenever the time range changes
export function useTopData(range: TimeRange) {
  const [artists, setArtists] = useState<Artist[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    // if the range changes before a request finishes, ignore the old one
    let cancelled = false

    async function load() {
      setStatus('loading')
      setError(null)
      try {
        const [artistData, trackData] = await Promise.all([
          getTopArtists(range),
          getTopTracks(range),
        ])
        if (cancelled) return
        const withGenres = await addGenres(artistData)
        if (cancelled) return
        setArtists(withGenres)
        setTracks(trackData)
        setStatus('done')
      } catch (err) {
        if (cancelled) return
        let message = 'Something went wrong loading your data.'
        if (err instanceof Error) {
          message = err.message
        }
        setError(message)
        setStatus('error')
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [range, reloadCount])

  // changing reloadCount makes the effect run again
  function retry() {
    setReloadCount(reloadCount + 1)
  }

  return { artists, tracks, status, error, retry }
}