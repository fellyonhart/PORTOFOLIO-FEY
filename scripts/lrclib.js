#!/usr/bin/env node
'use strict'

const API_BASE = 'https://lrclib.net'
const REQUEST_TIMEOUT_MS = 10_000
const MAX_TIMER_DELAY_MS = 2_147_483_647
const USER_AGENT =
  process.env.LRCLIB_USER_AGENT ||
  'PortfolioLyricsCLI/1.0 (https://github.com/fellyonhart/portofolio)'

const USAGE = `Usage:
  node scripts/lrclib.js --id <song-id> [--json]
  node scripts/lrclib.js --title <title> --artist <artist> [--album <album>] [--duration <seconds>] [--json]

Examples:
  node scripts/lrclib.js --title "Song Title" --artist "Artist Name"
  node scripts/lrclib.js --title "Song Title" --artist "Artist Name" --album "Album" --duration 245 --json
  node scripts/lrclib.js --id 12345

Set LRCLIB_USER_AGENT to override the default User-Agent header.`

function parseArgs(argv) {
  const options = { json: false }
  const valueOptions = new Set([
    '--id',
    '--title',
    '--artist',
    '--album',
    '--duration',
  ])

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--help' || argument === '-h') {
      options.help = true
      continue
    }

    if (argument === '--json') {
      options.json = true
      continue
    }

    if (!valueOptions.has(argument)) {
      throw new Error(`Unknown option: ${argument}`)
    }

    const value = argv[index + 1]
    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for ${argument}`)
    }

    options[argument.slice(2)] = value
    index += 1
  }

  return options
}

function validateOptions(options) {
  if (options.help) return

  if (options.id) {
    if (!/^\d+$/.test(options.id)) {
      throw new Error('--id must be a numeric song ID')
    }
    if (options.title || options.artist || options.album || options.duration) {
      throw new Error('Use either --id or title/artist options, not both')
    }
    return
  }

  if (!options.title || !options.artist) {
    throw new Error('Provide --id or both --title and --artist')
  }

  if (options.duration !== undefined) {
    const duration = Number(options.duration)
    if (!Number.isFinite(duration) || duration <= 0) {
      throw new Error('--duration must be a positive number of seconds')
    }
  }
}

function buildUrl(options) {
  if (options.id) {
    return new URL(`/api/get/${encodeURIComponent(options.id)}`, API_BASE)
  }

  const url = new URL('/api/get', API_BASE)
  url.searchParams.set('track_name', options.title)
  url.searchParams.set('artist_name', options.artist)
  if (options.album) url.searchParams.set('album_name', options.album)
  if (options.duration) url.searchParams.set('duration', options.duration)
  return url
}

function retryAfterMilliseconds(value) {
  if (!value) return null

  const seconds = Number(value)
  if (Number.isFinite(seconds) && seconds >= 0) {
    const milliseconds = Math.ceil(seconds * 1000)
    return Number.isSafeInteger(milliseconds) ? milliseconds : null
  }

  const retryAt = Date.parse(value)
  return Number.isNaN(retryAt) ? null : Math.max(0, retryAt - Date.now())
}

function sleep(milliseconds) {
  const end = Date.now() + milliseconds
  return new Promise((resolve) => {
    const wait = () => {
      const remaining = end - Date.now()
      if (remaining <= 0) {
        resolve()
        return
      }
      setTimeout(wait, Math.min(remaining, MAX_TIMER_DELAY_MS))
    }
    wait()
  })
}

async function requestLyrics(url, retry = 0) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    let response
    try {
      response = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
        signal: controller.signal,
      })
    } catch (error) {
      if (controller.signal.aborted) {
        throw new Error(`LRCLIB request timed out after ${REQUEST_TIMEOUT_MS} ms`)
      }
      throw new Error(`Network error while contacting LRCLIB: ${error.message}`)
    }

    if (response.status === 404) return null

    if (response.status === 429) {
      const wait = retryAfterMilliseconds(response.headers.get('Retry-After'))
      if (retry > 0) {
        const waitMessage =
          wait === null
            ? ''
            : ` Wait at least ${Math.ceil(wait / 1000)} seconds before trying again.`
        throw new Error(`LRCLIB rate limit persisted after one retry.${waitMessage}`)
      }
      if (wait === null) {
        throw new Error(
          'LRCLIB rate limit reached without a valid Retry-After header; not retrying.',
        )
      }

      clearTimeout(timeout)
      console.error(
        `LRCLIB rate limit reached. Waiting ${Math.ceil(wait / 1000)} seconds before one retry.`,
      )
      await sleep(wait)
      return requestLyrics(url, retry + 1)
    }

    if (!response.ok) {
      throw new Error(`LRCLIB returned HTTP ${response.status} ${response.statusText}`)
    }

    let data
    try {
      data = await response.json()
    } catch {
      if (controller.signal.aborted) {
        throw new Error(`LRCLIB request timed out after ${REQUEST_TIMEOUT_MS} ms`)
      }
      throw new Error('LRCLIB returned invalid JSON')
    }

    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('LRCLIB returned an unexpected JSON response')
    }

    return data
  } finally {
    clearTimeout(timeout)
  }
}

function preferredLyrics(data) {
  if (typeof data.syncedLyrics === 'string' && data.syncedLyrics.trim()) {
    return data.syncedLyrics
  }
  if (typeof data.plainLyrics === 'string' && data.plainLyrics.trim()) {
    return data.plainLyrics
  }
  return null
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(USAGE)
    return
  }
  validateOptions(options)

  const data = await requestLyrics(buildUrl(options))
  if (!data) {
    console.log('Lirik tidak ditemukan')
    process.exitCode = 1
    return
  }

  const lyrics = preferredLyrics(data)
  if (!lyrics) {
    console.log('Lirik tidak ditemukan')
    process.exitCode = 1
    return
  }

  if (options.json) {
    console.log(JSON.stringify(data, null, 2))
  } else {
    process.stdout.write(`${lyrics.trimEnd()}\n`)
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`)
  process.exitCode = 1
})
