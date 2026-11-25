import { toPng } from 'html-to-image'
import { useRef, useState } from 'react'
import type { Personality } from '../lib/personalities'
import { availableStats } from '../lib/stats'
import type { Artist, Track } from '../types'

// instagram story size
const CARD_WIDTH = 1080
const CARD_HEIGHT = 1920
// how small the preview is drawn (0.3 = 30% of the real size)
const PREVIEW_SCALE = 0.3

interface Props {
  personality: Personality
  artists: Artist[]
  tracks: Track[]
  rangeLabel: string
}

// the share image, a small preview of it, and a button to download it
export default function ShareCard({ personality, artists, tracks, rangeLabel }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const topArtists = artists.slice(0, 5)

  // every stat that's available gets shown on the card
  const stats = availableStats(false)
  const cardStats = stats.map(function (stat) {
    const result = stat.compute({ artists, tracks, olderArtists: [] })
    return { label: stat.label, value: result.value }
  })

  // turns the card into a png and downloads it
  async function handleDownload() {
    const node = cardRef.current
    if (node === null) {
      return
    }
    setError(null)
    try {
      const dataUrl = await toPng(node, {
        cacheBust: true,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
      })
      const link = document.createElement('a')
      link.download = 'soundprint.png'
      link.href = dataUrl
      link.click()
    } catch {
      setError('Could not make the image. Try again, or check the console for details.')
    }
  }

  return (
    <div>
      <h2>Share card</h2>

      {/* the real card is 1080x1920, so draw it scaled down for the preview */}
      <div
        style={{
          width: CARD_WIDTH * PREVIEW_SCALE,
          height: CARD_HEIGHT * PREVIEW_SCALE,
          overflow: 'hidden',
        }}
      >
        <div style={{ transform: 'scale(' + PREVIEW_SCALE + ')', transformOrigin: 'top left' }}>

          {/* this div is the image that gets downloaded, so the ref goes here */}
          <div ref={cardRef} style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
            <p>soundprint</p>
            <p>{rangeLabel}</p>

            <h1>{personality.label}</h1>
            <p>{personality.description}</p>

            <h2>Top artists</h2>
            {topArtists.map(function (artist) {
              return (
                <div key={artist.id}>
                  {artist.images[0] && (
                    <img src={artist.images[0].url} alt="" crossOrigin="anonymous" />
                  )}
                  <span>{artist.name}</span>
                </div>
              )
            })}

            {cardStats.map(function (stat) {
              return (
                <div key={stat.label}>
                  <p>{stat.value}</p>
                  <p>{stat.label}</p>
                </div>
              )
            })}

            <p>Data from Spotify and Last.fm</p>
          </div>
        </div>
      </div>

      <button onClick={handleDownload}>Download image</button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}