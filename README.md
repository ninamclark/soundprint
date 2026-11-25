# Soundprint
 
A listening-stats dashboard that turns your Spotify top artists and tracks into a personality, a few unusual stats, and a shareable story-sized image.
 
**Live demo:** <
 
## What it does
 
- **Log in with Spotify** and see your top artists and tracks for the last 4 weeks, 6 months, or 12 months.
- **Genre diversity score (0-100):** how spread out your taste is, calculated with Shannon entropy.
- **Music age:** the average release year of your top tracks, and a breakdown by decade.
- **Loyalty:** how much of your top tracks come from a single artist.
- **Personality card:** a label like "The Genre Hopper" or "The Superfan", chosen by a short, readable set of rules, with the numbers that led to it.
- **Share card:** a 1080 x 1920 image sized for an Instagram story, downloadable as a PNG.
- **Charts:** your top genres and your tracks by decade.
## Tech stack
 
- React, TypeScript, and Vite
- Tailwind CSS
- Recharts for the charts
- html-to-image for the PNG export
- Spotify Web API (Authorization Code flow with PKCE) and the Last.fm API
- No backend and no database. Everything runs in the browser.
## How it works
 
1. **Login:** the app uses the Authorization Code flow with PKCE, so it needs no client secret and no server. A random code verifier and a `state` value are kept in `sessionStorage`, and the `state` is checked when Spotify redirects back, which protects against forged redirects.
2. **Data:** it requests your top artists and top tracks (up to 50 each) for the selected time range.
3. **Genres:** Spotify no longer returns genres for most artists, so the app looks up each artist's top tags on Last.fm and uses those. Results are cached in memory so switching time ranges doesn't repeat lookups, and a failed lookup just means that artist has no genres.
4. **Stats:** each stat is a small pure function in `src/lib/stats.ts` that takes the data and returns a number, with no network or screen involved.
5. **Personality:** `src/lib/personalities.ts` checks a fixed list of rules in order, and the first one that matches wins. The cutoffs are named constants at the top of the file.
6. **Share card:** the card is drawn at its full size and scaled down for the preview. The download button turns the full-size element into a PNG in your browser.
## Key decisions
 
- **Client-side only.** PKCE removes the need for a backend, which keeps the app simple and means no listening data is ever sent to or stored on a server of mine.
- **Stats as pure functions.** Keeping the math separate from the interface makes each stat easy to reason about and to test.
- **Last.fm for genres.** Spotify's genre field now comes back empty for the artists I tested, so the diversity stat needed another source. The trade-off is that Last.fm tags are crowd-sourced and noisier, so the app only keeps the most popular few tags per artist.
- **Transparent personality rules.** The card shows the numbers behind the label instead of presenting it as a black box.
## Limitations
 
- **Spotify limits who can log in.** Apps in Spotify's development mode only work for a small allow-list of users, so most people can't log in to a deployed copy. A demo mode that works without logging in is planned.
- **Top 50 only.** Spotify's top endpoints return at most 50 items per request, so every stat describes your top 50.
- **Genres are approximate.** They come from Last.fm tags, not from Spotify.
- **Minutes listened isn't available.** It can't be calculated from the top lists. It would need your Spotify data export, which I plan to support as an optional upload that runs entirely in the browser.
## What's next
 
- Demo mode with sample data, so anyone can try it without logging in
- An optional upload of your Spotify data export, unlocking minutes listened and listening-by-hour stats
- Customizable share cards, where you choose which stats appear
- Automated tests for the login flow and the stat functions
- More intricate and sleek design, different color options besides green
## Credits
 
Listening data comes from the Spotify Web API and genre tags from Last.fm. Soundprint is an independent project and is not affiliated with or endorsed by Spotify or Last.fm.
 
Built by Nina Clark. [LinkedIn](https://www.linkedin.com/in/ninamclark/) · [GitHub](https://github.com/ninamclark)
 