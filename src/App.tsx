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
        <main>
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
      <main>
        <h1>soundprint</h1>
  
        {error && <p role="alert">{error}</p>}
  
        {me && (
          <div>
            {me.images[0] && (
              <img
                src={me.images[0].url}
                alt={'Profile picture of ' + name}
              />
            )}
            <p>Hi, {name}</p>
            <button onClick={handleLogout}>Log out</button>
            <Dashboard />
          </div>
        )}
  
        {!me && (
          <div>
            <p>See your top artists, tracks, and genres as simple charts.</p>
            <button onClick={() => login()}>Log in with Spotify</button>
            <button>Try the demo</button>
          </div>
        )}
      </main>
    )
}