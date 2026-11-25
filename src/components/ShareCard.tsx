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
      <h2 className="text-2xl font-semibold tracking-tight">Share card</h2>

      {/* the real card is 1080x1920, so draw it scaled down for the preview */}
      <div
        style={{
          width: CARD_WIDTH * PREVIEW_SCALE,
          height: CARD_HEIGHT * PREVIEW_SCALE,
          overflow: 'hidden',
        }}
      >
        <div style={{ transform: 'scale(' + PREVIEW_SCALE + ')', transformOrigin: 'top left' }}>

          {/* this div is the image that gets downloaded, so the ref and the background go here */}
          <div
            ref={cardRef}
            style={{
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              background:
                'radial-gradient(900px circle at 85% 8%, rgba(143, 191, 159, 0.35), transparent 60%), #0b0b0d',
            }}
            className="flex flex-col justify-between px-20 pt-40 pb-40 text-stone-100"
          >
            <div className="flex justify-between text-4xl text-stone-400">
              <p>soundprint</p>
              <p>{rangeLabel}</p>
            </div>

            <div>
              <h1 className="text-9xl font-semibold tracking-tight text-[#8fbf9f]">
                {personality.label}
              </h1>
              <p className="mt-8 text-5xl text-stone-300">{personality.description}</p>
            </div>

            <div>
              <h2 className="mb-8 text-4xl text-stone-400">Top artists</h2>
              {topArtists.map(function (artist) {
                return (
                  <div key={artist.id} className="mb-6 flex items-center gap-8">
                    {artist.images[0] && (
                      <img
                        src={artist.images[0].url}
                        alt=""
                        crossOrigin="anonymous"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    )}
                    <span className="text-5xl">{artist.name}</span>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-3 gap-8 border-t border-white/15 pt-10">
              {cardStats.map(function (stat) {
                return (
                  <div key={stat.label}>
                    <p className="text-8xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="mt-2 text-3xl text-stone-400">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <p className="text-3xl text-stone-500">Data from Spotify and Last.fm</p>
          </div>
        </div>
      </div>

      <button onClick={handleDownload} className="rounded-full bg-[var(--accent)] px-6 py-2 font-medium text-black hover:opacity-90">Download image</button>
      {error && <p role="alert">{error}</p>}
    </div>
  )
}