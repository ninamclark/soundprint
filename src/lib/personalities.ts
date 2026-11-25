// the numbers the personality is based on (all come from stats.ts)
export interface PersonalityInput {
    diversity: number
    averageYear: number
    loyalty: number
    decadeCount: number
    artistCount: number
  }
  
  export interface Personality {
    label: string
    description: string
    reasons: string[]
  }
  
//cutoffs
const HIGH_LOYALTY = 40
const MANY_DECADES = 4
const TOP_DIVERSITY = 75
const HIGH_DIVERSITY = 60
const LOW_DIVERSITY = 40
const RECENT_YEAR = 2022
const OLD_YEAR = 2015
// need at least this many artists for the label to mean anything
const MIN_ARTISTS = 10
  
  // turns your stats into a personality label, the first rule that matches wins
  export function getPersonality(input: PersonalityInput): Personality {
    if(input.artistCount < MIN_ARTISTS || input.averageYear === 0){
        return {
            label: 'Still tuning in',
            description: 'Listen to a bit more music and check back for your personality.',
            reasons: [],
          }
    }
    
  const isRecent = input.averageYear >= RECENT_YEAR
  const isOld = input.averageYear < OLD_YEAR

  // 1. one artist takes up a big chunk of your top tracks
  if (input.loyalty >= HIGH_LOYALTY) {
    return {
      label: 'The Superfan',
      description: 'One artist runs your whole listening life.',
      reasons: [input.loyalty + '% of your top tracks are from one artist'],
    }
  }

  // 2. your top tracks come from lots of different decades
  if (input.decadeCount >= MANY_DECADES) {
    return {
      label: 'The Archivist',
      description: 'You dig through the whole timeline of music.',
      reasons: ['Your top tracks span ' + input.decadeCount + ' decades'],
    }
  }

  // 3. extremely wide taste
  if (input.diversity >= TOP_DIVERSITY) {
    return {
      label: 'The Genre Hopper',
      description: 'No two songs in a row sound alike.',
      reasons: ['Your genre diversity is ' + input.diversity + ' out of 100'],
    }
  }

  // 4 and 5. wide taste, split by how recent your music is
  if (input.diversity >= HIGH_DIVERSITY) {
    if (isRecent) {
      return {
        label: 'The Trendsetter',
        description: 'Wide taste, and always up to date.',
        reasons: [
          'Your genre diversity is ' + input.diversity + ' out of 100',
          'Your top tracks average ' + input.averageYear,
        ],
      }
    }
    return {
      label: 'The Time Traveler',
      description: 'Wide taste, spread across the eras.',
      reasons: [
        'Your genre diversity is ' + input.diversity + ' out of 100',
        'Your top tracks average ' + input.averageYear,
      ],
    }
  }

  // 6, 7 and 8. narrow taste, split by how old your music is
  if (input.diversity <= LOW_DIVERSITY) {
    if (isRecent) {
      return {
        label: 'The Chart Chaser',
        description: 'You know what is new, and you stick with it.',
        reasons: [
          'Your genre diversity is ' + input.diversity + ' out of 100',
          'Your top tracks average ' + input.averageYear,
        ],
      }
    }
    if (isOld) {
      return {
        label: 'The Classicist',
        description: 'You found your sound a while ago.',
        reasons: [
          'Your genre diversity is ' + input.diversity + ' out of 100',
          'Your top tracks average ' + input.averageYear,
        ],
      }
    }
    return {
      label: 'The Specialist',
      description: 'You are deep in one lane.',
      reasons: ['Your genre diversity is ' + input.diversity + ' out of 100'],
    }
  }

  // 9. middle diversity, but older music
  if (isOld) {
    return {
      label: 'The Nostalgic',
      description: 'Your favorites have some years on them.',
      reasons: ['Your top tracks average ' + input.averageYear],
    }
  }

  // 10. everything else
  return {
    label: 'The All-Rounder',
    description: 'A bit of everything, and no strong lean.',
    reasons: ['Your genre diversity is ' + input.diversity + ' out of 100'],
  }
  }