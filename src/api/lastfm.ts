import type { Artist } from '../types'

const API_URL = 'https://ws.audioscrobbler.com/2.0/'
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY

// how many tags to keep per artist, and how popular a tag has to be (0-100) to count
const MAX_TAGS = 3
const MIN_TAG_COUNT = 50

// the parts of last.fm's response that we use
interface LastfmTag {
  name: string
  count: number
}

interface TopTagsResponse {
  toptags: { tag: LastfmTag[] | undefined } | undefined
  error: number | undefined
}

const cache: Record<string, string[]> = {}

// asks last.fm for one artist's top tags, like ['pop', 'dance pop']
// returns an empty list if anything goes wrong, so the app keeps working
export async function getArtistGenres(name: string): Promise<string[]> {
  // already looked this one up
  if (cache[name] !== undefined) {
    return cache[name]
  }

  // URL + URLSearchParams builds the "?method=...&artist=..." part for us
  const url = new URL(API_URL)
  url.search = new URLSearchParams({
    method: 'artist.getTopTags',
    artist: name,
    api_key: API_KEY,
    format: 'json',
    autocorrect: '1',
  }).toString()

  try {
    const response = await fetch(url)
    if (!response.ok) {
      return []
    }
    const data: TopTagsResponse = await response.json()

    if (data.error !== undefined || data.toptags === undefined) {
      return []
    }
    const tags = data.toptags.tag
    if (tags === undefined) {
      cache[name] = []
      return []
    }

    // tags come most popular first, keep the good ones
    const genres: string[] = []
    for (let i = 0; i < tags.length; i++) {
      if (genres.length >= MAX_TAGS) {
        break
      }
      if (Number(tags[i].count) >= MIN_TAG_COUNT) {
        genres.push(tags[i].name.toLowerCase())
      }
    }

    cache[name] = genres
    return genres
  } catch {
    return []
  }
}

// fills in each artist's genres using last.fm, returns a new list of artists
export async function addGenres(artists: Artist[]): Promise<Artist[]> {

  const lookups: Promise<string[]>[] = []
  for (let i = 0; i < artists.length; i++) {
    lookups.push(getArtistGenres(artists[i].name))
  }
  const genreLists = await Promise.all(lookups)

  // copy each artist with the new genres filled in
  const result: Artist[] = []
  for (let i = 0; i < artists.length; i++) {
    result.push({ ...artists[i], genres: genreLists[i] })
  }
  return result
}