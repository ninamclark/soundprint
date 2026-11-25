import type { Track } from '../types'

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const top = tracks.slice(0, 10)

  return (
    <section>
      <h2>Top tracks</h2>
      {top.length === 0 && <p>No listening history for this time range yet.</p>}
      <ol>
        {top.map((track) => {
          const artistNames = track.artists.map((a) => a.name).join(', ')
          return (
            <li key={track.id}>
              {track.album.images[0] && (
                <img src={track.album.images[0].url} alt="" width="48" height="48" />
              )}
              <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                {track.name}
              </a>{' '}
              by {artistNames}
            </li>
          )
        })}
      </ol>
    </section>
  )
}