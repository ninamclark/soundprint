import type { Artist } from '../types'

export default function ArtistList({ artists }: { artists: Artist[] }) {
  // only show the top 10, the rest is kept for the charts later
  const top = artists.slice(0, 10)

  return (
    <section>
      <h2>Top artists</h2>
      {top.length === 0 && <p>No listening history for this time range yet.</p>}
      <ol>
        {top.map((artist) => (
          <li key={artist.id}>
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