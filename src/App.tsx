import { useEffect, useRef, useState } from 'react'
import { getMe, type Me } from './api/spotify'
import { getToken, handleCallback, login, logout } from './lib/auth'
import Dashboard from './components/Dashboard'


export default function App() {
  // states
  const [me, setMe] = useState<Me | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const started = useRef(false)

  useEffect(() => {
    if (started.current == true){
      return;
    } else{
      started.current = true;
    }
    async function checkLogin() {
      // handle spotify sending the user back (does nothing on a normal visit)
      const result = await handleCallback()
      if (result.status === 'error') {
        setError(result.message)
      }
    
      // if there's a valid token, get the user's info
      if (getToken()) {
        try {
          const user = await getMe()
          setMe(user)
        } catch {
          setError('Your session expired. Please log in again.')
        }
      }
    
      setLoading(false)
    }
    
    checkLogin()
  }, [])

  // ----- log out button -----
  function handleLogout() {
    logout()
    setMe(null)
  }
    // still checking if the user is logged in
    if (loading) {
      return (
        <main className="mx-auto max-w-5xl px-6 py-10">
          <p>Loading...</p>
        </main>
      )
    }
  
    // work out the name to show (display_name can be null)
    let name = 'there'
    if (me && me.display_name) {
      name = me.display_name
    }
  
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight">soundprint</h1>
  
        {error && <p role="alert">{error}</p>}
  
        {me && (
          <div>
            <div className="mt-6 mb-8 flex items-center gap-4">
            {me.images[0] && (
              <img
                src={me.images[0].url}
                alt={'Profile picture of ' + name}
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <p>Hi, {name}</p>
            <button onClick={handleLogout}
            className="ml-auto rounded-full border border-white/20 px-4 py-1 text-sm hover:bg-white/10">Log out</button>
            </div>
            <Dashboard />
          </div>
        )}
  
        {!me && (
          <div>
            <p>See your top artists, tracks, and genres as simple charts.</p>
            <button onClick={() => login()}
              className="rounded-full bg-[var(--accent)] px-6 py-2 font-medium text-black"
              >Log in with Spotify</button>
            <button>Try the demo</button>
          </div>
        )}
      </main>
    )
}