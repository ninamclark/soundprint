import type { Artist } from '../types'

export default function ArtistList({ artists }: { artists: Artist[] }) {
  // only show the top 10, the rest is kept for the charts later
  const top = artists.slice(0, 10)

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">Top artists</h2>
      {top.length === 0 && <p className="mt-4 text-stone-400">No listening history for this time range yet.</p>}
      <ol className="mt-4 divide-y divide-white/10">
        {top.map((artist) => (
          <li key={artist.id} className="flex items-center gap-4 py-3">
            {artist.images[0] && (
              <img src={artist.images[0].url} alt="" width="48" height="48" />
            )}
            <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
              {artist.name}
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}