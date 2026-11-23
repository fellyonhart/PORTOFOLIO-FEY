'use client'

import { useEffect, useRef, useState } from 'react'
import { useMusicPlayer, useSetMusicTime } from '@/contexts/MusicContext'
import { musicTracks } from '@/data/music'

const tracks = musicTracks.map(({ src }) => src)
const lastTrackKey = 'portfolio_last_random_track'

function randomTrack(exclude?: string) {
  const choices = tracks.filter((track) => track !== exclude)
  const pool = choices.length > 0 ? choices : tracks
  return pool[Math.floor(Math.random() * pool.length)]
}

function trackTitle(track: string) {
  return musicTracks.find((item) => item.src === track)?.title ?? track
}

export default function RandomMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const initializedRef = useRef(false)
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying, setIsReady } =
    useMusicPlayer()
  const setCurrentTime = useSetMusicTime()
  const [error, setError] = useState('')
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const [trackPickerOpen, setTrackPickerOpen] = useState(false)
  const [trackQuery, setTrackQuery] = useState('')

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    if (audioRef.current) audioRef.current.volume = 1.0
    const previousTrack =
      window.sessionStorage.getItem(lastTrackKey) ?? undefined
    const nextTrack = randomTrack(previousTrack)
    window.sessionStorage.setItem(lastTrackKey, nextTrack)
    setCurrentTrack(nextTrack)
    setIsReady(true)
  }, [setCurrentTrack, setIsReady])

  const playTrack = async (track: string) => {
    const audio = audioRef.current
    if (!audio) return

    setCurrentTrack(track)
    setCurrentTime(0)
    window.sessionStorage.setItem(lastTrackKey, track)
    setError('')
    audio.src = track

    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
      setError('Could not play this track.')
      setMobileControlsOpen(true)
    }
  }

  const playRandomTrack = () => playTrack(randomTrack(currentTrack))
  const filteredTracks = musicTracks.filter((track) =>
    `${track.title} ${track.artist ?? ''}`
      .toLowerCase()
      .includes(trackQuery.trim().toLowerCase()),
  )

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audio.paused) {
      audio.pause()
      return
    }

    setError('')
    if (audio.src !== new URL(currentTrack, window.location.href).href) {
      audio.src = currentTrack
    }
    try {
      await audio.play()
    } catch {
      setIsPlaying(false)
      setError('Could not play this track.')
      setMobileControlsOpen(true)
    }
  }

  return (
    <div className="fixed bottom-4 right-3 z-40 flex max-w-[calc(100vw-1.5rem)] items-center justify-end gap-1 sm:bottom-6 sm:right-6 sm:gap-2 md:bottom-40 md:right-16">
      <audio
        ref={audioRef}
        preload="none"
        loop
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false)
          setError('Track file could not be loaded.')
          setMobileControlsOpen(true)
        }}
      />
      {trackPickerOpen && (
        <section
          id="music-track-picker"
          aria-label="Choose a music track"
          className="absolute bottom-full right-0 mb-3 flex max-h-[55svh] w-80 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-2xl border border-line bg-card shadow-soft"
          onKeyDown={(event) => {
            if (event.key === 'Escape') setTrackPickerOpen(false)
          }}
        >
          <div className="border-b border-line p-3">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-ink">Choose a song</h2>
                <p className="font-mono text-[10px] text-muted">
                  {musicTracks.length} tracks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrackPickerOpen(false)}
                aria-label="Close song list"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted hover:bg-bg-2 hover:text-ink"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>
            <label className="sr-only" htmlFor="music-track-search">
              Search songs
            </label>
            <input
              id="music-track-search"
              type="search"
              value={trackQuery}
              onChange={(event) => setTrackQuery(event.target.value)}
              placeholder="Search songs or artists"
              className="w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-gold"
            />
          </div>
          <ul className="min-h-0 overflow-y-auto p-2" aria-label="Songs">
            {filteredTracks.map((track) => {
              const isCurrentTrack = track.src === currentTrack
              return (
                <li key={track.src}>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackPickerOpen(false)
                      void playTrack(track.src)
                    }}
                    aria-current={isCurrentTrack ? 'true' : undefined}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
                      isCurrentTrack
                        ? 'bg-tech-tag text-ink'
                        : 'text-muted hover:bg-bg-2 hover:text-ink'
                    }`}
                  >
                    <i
                      className={`fa-solid ${isCurrentTrack && isPlaying ? 'fa-volume-high' : 'fa-music'} w-4 shrink-0 text-xs text-gold`}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {track.title}
                      </span>
                      {track.artist && (
                        <span className="block truncate text-xs text-muted">
                          {track.artist}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
            {filteredTracks.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted">
                No songs found.
              </li>
            )}
          </ul>
        </section>
      )}
      <div
        className={`${mobileControlsOpen ? 'flex' : 'hidden'} min-w-0 items-center gap-1 sm:flex sm:gap-2`}
      >
        {error && (
          <span
            role="alert"
            className="max-w-28 truncate rounded-lg border border-line bg-card px-2 py-2 text-xs text-muted shadow-soft sm:max-w-none sm:px-3"
          >
            {error}
          </span>
        )}
        <button
          type="button"
          onClick={() => setTrackPickerOpen((open) => !open)}
          aria-label={`Choose song. Current song: ${trackTitle(currentTrack)}`}
          aria-expanded={trackPickerOpen}
          aria-controls="music-track-picker"
          className="flex min-w-0 w-28 max-w-[32vw] items-center gap-2 rounded-full border border-line bg-card px-3 py-3 text-left text-xs text-ink shadow-soft outline-none transition-colors hover:border-gold focus-visible:ring-2 focus-visible:ring-gold sm:w-36 sm:max-w-[40vw]"
        >
          <i className="fa-solid fa-list shrink-0 text-gold" aria-hidden="true" />
          <span className="truncate">{trackTitle(currentTrack)}</span>
        </button>
        <button
          type="button"
          onClick={() => void togglePlayback()}
          aria-label={
            isPlaying ? 'Pause background music' : 'Play background music'
          }
          title={isPlaying ? 'Pause music' : 'Play music'}
          className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-3 py-3 text-ink shadow-soft transition-colors hover:border-gold hover:text-gold-deep sm:px-4"
        >
          <i
            className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-music'}`}
            aria-hidden="true"
          />
          <span className="text-xs font-semibold sm:text-sm">Music</span>
        </button>
        <button
          type="button"
          onClick={() => void playRandomTrack()}
          aria-label="Play another random track"
          title="Play another random track"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-card text-muted shadow-soft transition-colors hover:border-gold hover:text-gold-deep"
        >
          <i className="fa-solid fa-shuffle" aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => setMobileControlsOpen((open) => !open)}
        aria-label={
          mobileControlsOpen ? 'Close music controls' : 'Open music controls'
        }
        aria-expanded={mobileControlsOpen}
        title={mobileControlsOpen ? 'Close music controls' : 'Music controls'}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-card text-ink shadow-soft sm:hidden"
      >
        <i
          className={`fa-solid ${mobileControlsOpen ? 'fa-xmark' : 'fa-music'}`}
          aria-hidden="true"
        />
      </button>
      <span className="sr-only" aria-live="polite">
        {isPlaying ? 'Music playing' : 'Music paused'}:{' '}
        {trackTitle(currentTrack)}
      </span>
    </div>
  )
}
