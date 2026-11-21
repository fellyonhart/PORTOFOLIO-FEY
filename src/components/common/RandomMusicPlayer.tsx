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
        <select
          aria-label="Select music track"
          value={currentTrack}
          onChange={(event) => void playTrack(event.target.value)}
          className="w-28 min-w-0 max-w-[32vw] truncate rounded-full border border-line bg-card px-2 py-3 text-xs text-ink shadow-soft outline-none transition-colors hover:border-gold focus-visible:ring-2 focus-visible:ring-gold sm:w-36 sm:max-w-[40vw] sm:px-3"
        >
          {tracks.map((track) => (
            <option key={track} value={track}>
              {trackTitle(track)}
            </option>
          ))}
        </select>
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
