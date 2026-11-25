import { getToken, logout } from '../lib/auth'

const baseUrl = 'https://api.spotify.com/v1'
import type { Artist, ListResponse, TimeRange, Track } from '../types'

// error that remembers the http status, so the page can tell what went wrong
export class SpotifyError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// what /me gives back (only the parts I use)
export interface Me {
  id: string
  display_name: string | null
  images: { url: string }[]
}

// sends a request to spotify with my token attached
export async function spotifyFetch<T>(path: string): Promise<T> {
  const token = getToken()
  if (!token) {
    throw new SpotifyError(401, 'Not logged in')
  }

  const response = await fetch(`${baseUrl}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  // 401 means the token expired or isn't valid anymore
  if (response.status === 401) {
    logout()
    throw new SpotifyError(401, 'Your session expired')
  }

  if (!response.ok) {
    throw new SpotifyError(response.status, 'Spotify request failed')
  }

  return response.json() as Promise<T>
}

// gets the logged in user's name and picture
export function getMe(): Promise<Me> {
  return spotifyFetch<Me>('/me')
}

// top artists for a time range (50 so the charts later have enough data)
export async function getTopArtists(range: TimeRange, limit = 50): Promise<Artist[]> {
    const data = await spotifyFetch<ListResponse<Artist>>(
      `/me/top/artists?time_range=${range}&limit=${limit}`,
    )
    return data.items
  }
  
export async function getTopTracks(range: TimeRange, limit = 50): Promise<Track[]> {
const data = await spotifyFetch<ListResponse<Track>>(
    `/me/top/tracks?time_range=${range}&limit=${limit}`,
)
return data.items
}