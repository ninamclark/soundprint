import type { Artist, Track } from '../types'

export interface GenreCount {
  genre: string
  count: number
}
const LOW_DIVERSITY = 40
const HIGH_DIVERSITY = 70

// counts how many of the artists have each genre, biggest first
export function genreCounts(artists: Artist[]): GenreCount[] {
    const counts: Record<string, number> = {}  
    for (let i = 0; i < artists.length; i++) {
        const artist = artists[i]
        if (artist.genres === undefined) {
            continue
        }
        for (let j = 0; j < artist.genres.length; j++) {
            const genre = artist.genres[j]
            if (counts[genre] === undefined) {
              counts[genre] = 0
            }
            counts[genre] = counts[genre] + 1
          }
        }
    const result: GenreCount[] = []
    const genres = Object.keys(counts)
    for (let i = 0; i < genres.length; i++) {
        const genre = genres[i]
        result.push({ genre: genre, count: counts[genre] })
    }

    result.sort(function (a, b) {
        if (a.count !== b.count) {
          return b.count - a.count
        }
        return a.genre.localeCompare(b.genre)
    })
  return result
}

// ---------- genre diversity ----------

// 0 = all one genre, 100 = spread perfectly evenly
// shannon entropy of the genre shares, divided by its max so it's 0-100
export function genreDiversity(artists: Artist[]): number {
    const counts = genreCounts(artists)
    if(counts.length <2){
        return 0;
    }
    let total = 0
    let entropy = 0
    for(let i = 0; i<counts.length; i++){
        total += counts[i].count
    }
    for (let i = 0; i < counts.length; i++) {
        const share = counts[i].count / total
        entropy += share * Math.log(share)
    }
    entropy = entropy*-1
    let maxEntropy = Math.log(counts.length)
    let score = (entropy*100)/(maxEntropy)
  return Math.round(score)
}

export function diversityLabel(score: number): string {
    if (score < LOW_DIVERSITY) {
      return 'Focused'
    }
    if (score < HIGH_DIVERSITY) {
      return 'Balanced'
    }
    return 'Explorer'
  }

export function releaseYear(date: string): number {
    // the year is always the first 4 characters
    const year = Number(date.slice(0, 4))
    // Number() gives NaN for text that isn't a number, so check for that
    if (isNaN(year)) {
      return 0
    }
    return year
}
  
// average release year of the tracks (skips tracks with a bad date)
export function averageReleaseYear(tracks: Track[]): number {
let total = 0
let count = 0
for (let i = 0; i < tracks.length; i++) {
    const year = releaseYear(tracks[i].album.release_date)
    // 0 means the date was bad, so skip it
    if (year === 0) {
    continue
    }
    total += year
    count += 1
}
// nothing valid
if (count === 0) {
    return 0
}
return Math.round(total / count)
}

export interface DecadeCount {
  decade: string
  count: number
}

// how many tracks per decade, oldest first, like { decade: '1990s', count: 7 }
export function byDecade(tracks: Track[]): DecadeCount[] {
    // counts per decade, using the number as the key, like { 1990: 7 }
    const counts: Record<number, number> = {}
    for (let i = 0; i < tracks.length; i++) {
      const year = releaseYear(tracks[i].album.release_date)
      // 0 means a bad date, so skip it
      if (year === 0) {
        continue
      }

      // 1994 -> 199.4 -> 199 -> 1990
      const decade = Math.floor(year / 10) * 10
      if (counts[decade] === undefined) {
        counts[decade] = 0
      }
      counts[decade] = counts[decade] + 1
    }
  
    const decades = Object.keys(counts).map(Number)
    decades.sort(function (a, b) {
      return a - b
    })
  
    const result: DecadeCount[] = []
    for (let i = 0; i < decades.length; i++) {
      result.push({ decade: decades[i] + 's', count: counts[decades[i]] })
    }
    return result
  }


// loyalty. what share (0-100) of the tracks come from your most common artist
export function loyalty(tracks: Track[]): number {
    if (tracks.length === 0) {
        return 0
    }
    const counts: Record<string, number> = {}
    for (let i = 0; i < tracks.length; i++) {
      const artist = tracks[i].artists[0]
      // a track with no artist listed gets skipped
      if (artist === undefined) {
        continue
      }
      if (counts[artist.id] === undefined) {
        counts[artist.id] = 0
      }
      counts[artist.id] = counts[artist.id] + 1
    }

    let biggest = 0
    const ids = Object.keys(counts)
    for (let i = 0; i < ids.length; i++) {
        if (counts[ids[i]] > biggest) {
        biggest = counts[ids[i]]
        }
    }

    return Math.round(biggest / tracks.length * 100)
}

// rising and falling artists

export type Movement = 'new' | 'rising' | 'falling' | 'steady'

export interface ArtistMovement {
  artist: Artist
  movement: Movement
  change: number
}

// compares a recent list (like last 4 weeks) to an older one (like last 12 months)
export function artistMovement(recent: Artist[], older: Artist[]): ArtistMovement[] {
  // TODO: make a named constant for how many places counts as a real move (like 3)
  // TODO: for each recent artist, find its position in the older list
  // TODO: not in the older list at all -> 'new'
  // TODO: otherwise change = older position - recent position (positive means it climbed)
  // TODO: change bigger than the constant -> 'rising', smaller than minus the constant -> 'falling', else 'steady'
  return []
}


export interface StatInput {
  artists: Artist[]
  tracks: Track[]
  olderArtists: Artist[]
}

export interface Stat {
  id: string
  label: string
  source: 'api' | 'export'
  compute: (input: StatInput) => { value: string; caption: string }
}

// genre diversity, music age, loyalty
// each entry needs an id, a label, source: 'api', and a compute function
// every stat the app can show. add a new entry here and it shows up everywhere
export const allStats: Stat[] = [
    {
      id: 'genre-diversity',
      label: 'Genre diversity',
      source: 'api',
      compute: function (input) {
        const score = genreDiversity(input.artists)
        return {
          value: String(score),
          caption: diversityLabel(score),
        }
      },
    },
    {
      id: 'music-age',
      label: 'Music age',
      source: 'api',
      compute: function (input) {
        const year = averageReleaseYear(input.tracks)
        // 0 means there were no valid dates
        if (year === 0) {
          return { value: 'N/A', caption: 'No release dates found' }
        }
        const yearsAgo = new Date().getFullYear() - year
        return {
          value: String(year),
          caption: 'Your top tracks average ' + yearsAgo + ' years old',
        }
      },
    },
    {
      id: 'loyalty',
      label: 'Loyalty',
      source: 'api',
      compute: function (input) {
        const share = loyalty(input.tracks)
        return {
          value: share + '%',
          caption: 'of your top tracks are from one artist',
        }
      },
    },
  ]
  
  // returns only the stats that can be shown with the data you have
  export function availableStats(hasExport: boolean): Stat[] {
    const result: Stat[] = []
    for (let i = 0; i < allStats.length; i++) {
      const stat = allStats[i]
      // 'api' stats always work, 'export' stats need the uploaded data
      if (stat.source === 'api') {
        result.push(stat)
      }
      if (stat.source === 'export' && hasExport) {
        result.push(stat)
      }
    }
    return result
  }