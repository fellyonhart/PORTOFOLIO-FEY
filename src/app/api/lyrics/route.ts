import { NextResponse } from 'next/server'

const LRCLIB_API = 'https://lrclib.net'
const USER_AGENT =
  'Feyy.Dev/2.0 (https://github.com/fellyonhart/portofolio)'
const REQUEST_TIMEOUT_MS = 8_000

type LyricsRecord = {
  trackName?: unknown
  artistName?: unknown
  syncedLyrics?: unknown
  plainLyrics?: unknown
}

function normalize(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function selectSearchResult(
  results: LyricsRecord[],
  title: string,
  artist?: string,
) {
  const matches = results.filter(
    (result) =>
      typeof result.trackName === 'string' &&
      normalize(result.trackName) === normalize(title),
  )

  if (artist) {
    const normalizedArtist = normalize(artist)
    const artistMatch = matches.find(
      (result) =>
        typeof result.artistName === 'string' &&
        (normalize(result.artistName).includes(normalizedArtist) ||
          normalizedArtist.includes(normalize(result.artistName))),
    )
    if (artistMatch) return artistMatch
  }

  return matches.find(
    (result) =>
      (typeof result.syncedLyrics === 'string' &&
        result.syncedLyrics.trim()) ||
      (typeof result.plainLyrics === 'string' && result.plainLyrics.trim()),
  )
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const title = params.get('title')?.trim()
  const artist = params.get('artist')?.trim()

  if (!title || title.length > 200 || (artist && artist.length > 200)) {
    return NextResponse.json({ error: 'Invalid track information' }, { status: 400 })
  }

  const url = new URL(artist ? '/api/get' : '/api/search', LRCLIB_API)
  if (artist) {
    url.searchParams.set('track_name', title)
    url.searchParams.set('artist_name', artist)
  } else {
    url.searchParams.set('q', title)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    let response: Response
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: controller.signal,
        next: { revalidate: 86_400 },
      })
    } catch {
      return NextResponse.json(
        { error: controller.signal.aborted ? 'LRCLIB request timed out' : 'LRCLIB is unavailable' },
        { status: controller.signal.aborted ? 504 : 502 },
      )
    }

    if (response.status === 404) {
      return NextResponse.json({ syncedLyrics: null, plainLyrics: null }, { status: 404 })
    }
    if (response.status === 429) {
      const headers = new Headers()
      const retryAfter = response.headers.get('Retry-After')
      if (retryAfter) headers.set('Retry-After', retryAfter)
      return NextResponse.json({ error: 'LRCLIB rate limit reached' }, { status: 429, headers })
    }
    if (!response.ok) {
      return NextResponse.json(
        { error: `LRCLIB returned HTTP ${response.status}` },
        { status: 502 },
      )
    }

    let data: LyricsRecord | LyricsRecord[]
    try {
      data = await response.json()
    } catch {
      const timedOut = controller.signal.aborted
      return NextResponse.json(
        { error: timedOut ? 'LRCLIB request timed out' : 'LRCLIB returned invalid JSON' },
        { status: timedOut ? 504 : 502 },
      )
    }

    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'LRCLIB returned invalid JSON' }, { status: 502 })
    }

    const record = Array.isArray(data)
      ? selectSearchResult(data, title, artist)
      : data
    if (!record) {
      return NextResponse.json({ syncedLyrics: null, plainLyrics: null }, { status: 404 })
    }

    return NextResponse.json({
      syncedLyrics:
        typeof record.syncedLyrics === 'string' ? record.syncedLyrics : null,
      plainLyrics:
        typeof record.plainLyrics === 'string' ? record.plainLyrics : null,
    })
  } finally {
    clearTimeout(timeout)
  }
}
