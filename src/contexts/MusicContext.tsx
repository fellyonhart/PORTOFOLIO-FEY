'use client'

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { musicTracks } from '@/data/music'

type MusicPlayerState = {
  currentTrack: string
  setCurrentTrack: Dispatch<SetStateAction<string>>
  isPlaying: boolean
  setIsPlaying: Dispatch<SetStateAction<boolean>>
  isReady: boolean
  setIsReady: Dispatch<SetStateAction<boolean>>
}

const MusicPlayerContext = createContext<MusicPlayerState | null>(null)
const MusicTimeContext = createContext<number | null>(null)
const SetMusicTimeContext =
  createContext<Dispatch<SetStateAction<number>> | null>(null)

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState(musicTracks[0].src)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const playerState = useMemo(
    () => ({
      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,
      isReady,
      setIsReady,
    }),
    [currentTrack, isPlaying, isReady],
  )

  return (
    <MusicPlayerContext.Provider value={playerState}>
      <MusicTimeContext.Provider value={currentTime}>
        <SetMusicTimeContext.Provider value={setCurrentTime}>
          {children}
        </SetMusicTimeContext.Provider>
      </MusicTimeContext.Provider>
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error('useMusicPlayer must be used within MusicProvider')
  }
  return context
}

export function useMusicTime() {
  const context = useContext(MusicTimeContext)
  if (context === null) {
    throw new Error('useMusicTime must be used within MusicProvider')
  }
  return context
}

export function useSetMusicTime() {
  const context = useContext(SetMusicTimeContext)
  if (!context) {
    throw new Error('useSetMusicTime must be used within MusicProvider')
  }
  return context
}
