// spotify's names for last 4 weeks / 6 months / 12 months
export type TimeRange = 'short_term' | 'medium_term' | 'long_term'

export interface Artist {
  id: string
  name: string
  images: { url: string }[]
  genres: string[]
  external_urls: { spotify: string }
}

export interface Track {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: {
    name: string
    images: { url: string }[]
    release_date: string
  }
  external_urls: { spotify: string }
}

// spotify wraps lists in an object with an items array
export interface ListResponse<T> {
  items: T[]
}