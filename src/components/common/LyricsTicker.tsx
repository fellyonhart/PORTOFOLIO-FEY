'use client'

import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { musicTracks } from '@/data/music'
import { useMusicPlayer, useMusicTime } from '@/contexts/MusicContext'

type LyricsResponse = {
  syncedLyrics: string | null
  plainLyrics: string | null
}

const lyricsCache = new Map<string, LyricsResponse | null>()

function activeSyncedLine(
  syncedLyrics: string,
  currentTime: number,
  lyricOffset = 0,
) {
  let activeLine = ''
  let activeStart = -Infinity

  for (const line of syncedLyrics.split(/\r?\n/)) {
    const timestampPattern = /\[(\d+):([0-5]\d)(?:[.:](\d{1,3}))?\]/g
    const timestamps: RegExpExecArray[] = []
    let match: RegExpExecArray | null
    while ((match = timestampPattern.exec(line)) !== null) {
      timestamps.push(match)
    }
    const text = line.replace(timestampPattern, '').trim()

    for (const timestamp of timestamps) {
      const fraction = (timestamp[3] ?? '').padEnd(3, '0')
      const start =
        Number(timestamp[1]) * 60 +
        Number(timestamp[2]) +
        (fraction ? Number(fraction) / 1000 : 0)
      const adjustedStart = start + lyricOffset
      if (adjustedStart <= currentTime && adjustedStart >= activeStart) {
        activeStart = adjustedStart
        activeLine = text
      }
    }
  }

  return activeLine
}

export default function LyricsTicker() {
  const { currentTrack, isReady } = useMusicPlayer()
  const currentTime = useMusicTime()
  const [lyrics, setLyrics] = useState<LyricsResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [overflow, setOverflow] = useState({ text: '', distance: 0 })
  const viewportRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const track = musicTracks.find((item) => item.src === currentTrack)

  useEffect(() => {
    if (!isReady || !track) return

    const cacheKey = `${track.title}\u0000${track.artist ?? ''}`
    if (lyricsCache.has(cacheKey)) {
      setLyrics(lyricsCache.get(cacheKey) ?? null)
      setLoading(false)
      setError(false)
      return
    }

    const controller = new AbortController()
    const query = new URLSearchParams({ title: track.title })
    if (track.artist) query.set('artist', track.artist)

    setLyrics(null)
    setLoading(true)
    setError(false)

    fetch(`/api/lyrics?${query}`, { signal: controller.signal })
      .then(async (response) => {
        if (response.status === 404) return null
        if (!response.ok)
          throw new Error(`Lyrics request failed (${response.status})`)
        return (await response.json()) as LyricsResponse
      })
      .then((result) => {
        if (controller.signal.aborted) return
        lyricsCache.set(cacheKey, result)
        setLyrics(result)
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setError(true)
        setLoading(false)
      })

    return () => controller.abort()
  }, [isReady, track])

  const syncedLine =
    lyrics?.syncedLyrics &&
    activeSyncedLine(lyrics.syncedLyrics, currentTime, track?.lyricOffset)
  const plainLine = lyrics?.plainLyrics
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  const plainIndex =
    plainLine && plainLine.length > 0
      ? Math.floor(currentTime / 6) % plainLine.length
      : 0
  const plainCurrentLine = plainLine?.[plainIndex]
  const text = loading
    ? 'Memuat lirik…'
    : error
      ? 'Lirik belum dapat dimuat'
      : !lyrics
        ? 'Lirik belum tersedia untuk lagu ini'
        : lyrics.syncedLyrics
          ? syncedLine || '♫'
          : plainCurrentLine || 'Lirik tidak ditemukan'
  const overflowDistance = overflow.text === text ? overflow.distance : 0
  const tickerStyle =
    overflowDistance > 0
      ? ({
          '--lyrics-offset': `-${overflowDistance}px`,
          '--lyrics-duration': `${Math.max(4, overflowDistance / 24 + 2)}s`,
        } as CSSProperties)
      : undefined

  useEffect(() => {
    const viewport = viewportRef.current
    const lyricText = textRef.current
    if (!viewport || !lyricText) return

    const measureOverflow = () => {
      const distance = Math.max(0, lyricText.scrollWidth - viewport.clientWidth)
      setOverflow((current) =>
        current.text === text && current.distance === distance
          ? current
          : { text, distance },
      )
    }

    measureOverflow()
    const observer = new ResizeObserver(measureOverflow)
    observer.observe(viewport)
    observer.observe(lyricText)
    return () => observer.disconnect()
  }, [text])

  return (
    <div
      className="lyrics-ticker flex h-10 w-64 min-w-0 max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-line bg-card px-3 text-ink shadow-md md:w-72"
      title={text}
      aria-label={`Lirik lagu: ${text}`}
    >
      <i
        className="fa-solid fa-music shrink-0 text-xs text-gold"
        aria-hidden="true"
      />
      <span
        ref={viewportRef}
        aria-live="polite"
        className="lyrics-ticker__viewport min-w-0 flex-1 font-mono text-[10px] md:text-xs"
      >
        <span key={text} className="lyrics-ticker__entry">
          <span
            ref={textRef}
            className={`lyrics-ticker__text${overflowDistance > 0 ? ' lyrics-ticker__text--scroll' : ''}`}
            style={tickerStyle}
          >
            {text}
          </span>
        </span>
      </span>
    </div>
  )
}
