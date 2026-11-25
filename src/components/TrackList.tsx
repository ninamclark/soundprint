import type { Track } from '../types'

export default function TrackList({ tracks }: { tracks: Track[] }) {
  const top = tracks.slice(0, 10)

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">Top tracks</h2>
      {top.length === 0 && <p className="mt-4 text-stone-400">No listening history for this time range yet.</p>}
      <ol className="mt-4 divide-y divide-white/10">
        {top.map((track) => {
          const artistNames = track.artists.map((a) => a.name).join(', ')
          return (
            <li key={track.id} className="flex items-center gap-4 py-3">
              {track.album.images[0] && (
                <img src={track.album.images[0].url} alt="" width="48" height="48" />
              )}
              <div>
              <a href={track.external_urls.spotify} target="_blank" rel="noreferrer">
                {track.name}
              </a> {' '}
              by {artistNames}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}