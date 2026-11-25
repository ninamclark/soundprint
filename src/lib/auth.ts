const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const redirectUri = import.meta.env.VITE_REDIRECT_URI as string
const scope = 'user-top-read'
const authUrl = 'https://accounts.spotify.com/authorize'
const tokenUrl = 'https://accounts.spotify.com/api/token'

// keys for sessionStorage
const VERIFIER_KEY = 'pkce_verifier'
const STATE_KEY = 'pkce_state'
const TOKEN_KEY = 'access_token'
const EXPIRES_KEY = 'token_expires_at'

// spotify only allows these characters in the verifier
const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'

// random string, used for both the verifier (64) and the state (16)
export function generateRandomString(length: number): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(length))
  let result = ''
  for (let i = 0; i < randomBytes.length; i++) {
    result += chars[randomBytes[i] % chars.length]
  }
  return result
}

// hash the verifier with SHA-256 and make it url safe
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', data)
  let binary = ''
  const bytes = new Uint8Array(hash)
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

// sends the user to spotify to log in
export async function login(): Promise<void> {
  const verifier = generateRandomString(64)
  const state = generateRandomString(16)
  const challenge = await generateCodeChallenge(verifier)

  // saving these because the page leaves my site and I need them when it comes back
  sessionStorage.setItem(VERIFIER_KEY, verifier)
  sessionStorage.setItem(STATE_KEY, state)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state: state,
  })
  window.location.assign(`${authUrl}?${params.toString()}`)
}

export type CallbackResult =
  | { status: 'none' }
  | { status: 'success' }
  | { status: 'error'; message: string }

// runs on page load, handles spotify sending the user back
export async function handleCallback(): Promise<CallbackResult> {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  const error = params.get('error')
  const state = params.get('state')

  // no login happening, just a normal visit
  if (!code && !error) return { status: 'none' }

  const savedState = sessionStorage.getItem(STATE_KEY)
  const verifier = sessionStorage.getItem(VERIFIER_KEY)
  sessionStorage.removeItem(STATE_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)

  // take the code out of the address bar
  window.history.replaceState({}, '', window.location.pathname)

  if (error || !code) {
    return { status: 'error', message: 'Login was cancelled or not allowed.' }
  }

  // state has to match or the redirect could be fake
  if (!state || state !== savedState || !verifier) {
    return { status: 'error', message: 'Login could not be verified. Please try again.' }
  }

  // trade the code for a token
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  })
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body,
  })
  if (!response.ok) {
    return { status: 'error', message: 'Spotify did not accept the login. Please try again.' }
  }

  const data = await response.json()
  sessionStorage.setItem(TOKEN_KEY, data.access_token)
  // expires_in is in seconds, so convert to a timestamp
  sessionStorage.setItem(EXPIRES_KEY, String(Date.now() + data.expires_in * 1000))
  return { status: 'success' }
}

// gives back the token, or null if it's missing or expired
export function getToken(): string | null {
  const token = sessionStorage.getItem(TOKEN_KEY)
  const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY) ?? 0)
  if (!token || Date.now() >= expiresAt) return null
  return token
}

export function logout(): void {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(EXPIRES_KEY)
  sessionStorage.removeItem(VERIFIER_KEY)
  sessionStorage.removeItem(STATE_KEY)
}