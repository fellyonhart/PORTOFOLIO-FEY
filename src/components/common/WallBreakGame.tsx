'use client'

import { useEffect, useState } from 'react'
import PortfolioCharacter from '@/components/common/PortfolioCharacter'

export default function WallBreakGame() {
  const [strikes, setStrikes] = useState(0)
  const [slash, setSlash] = useState({ id: 0, x: 50, y: 45 })
  const [wallStrength, setWallStrength] = useState(6)
  const [character3DEnabled, setCharacter3DEnabled] = useState(true)
  const isBroken = strikes >= wallStrength

  useEffect(() => {
    setWallStrength(Math.floor(Math.random() * 11) + 2)
    const savedCharacterMode = window.localStorage.getItem(
      'portfolio-character-3d',
    )
    if (savedCharacterMode !== null) {
      setCharacter3DEnabled(savedCharacterMode === 'on')
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      'portfolio-character-3d',
      character3DEnabled ? 'on' : 'off',
    )
  }, [character3DEnabled])

  const handleStrike = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isBroken) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = event.clientX
      ? ((event.clientX - bounds.left) / bounds.width) * 100
      : 50
    const y = event.clientY
      ? ((event.clientY - bounds.top) / bounds.height) * 100
      : 45

    setSlash({
      id: slash.id + 1,
      x: Math.min(90, Math.max(10, x)),
      y: Math.min(90, Math.max(10, y)),
    })
    setStrikes((count) => Math.min(count + 1, wallStrength))
  }

  const reset = () => {
    setStrikes(0)
    setSlash({ id: 0, x: 50, y: 45 })
    setWallStrength(Math.floor(Math.random() * 11) + 2)
  }

  const toggleCharacter3D = () => {
    setCharacter3DEnabled((enabled) => !enabled)
  }

  return (
    <div
      className={`wall-game relative aspect-[4/4.5] w-full overflow-hidden ${
        isBroken ? 'is-broken' : ''
      }`}
      role="group"
      aria-label="Interactive wall"
    >
      <div className="wall-reveal" aria-hidden={!isBroken}>
        {isBroken && character3DEnabled && (
          <PortfolioCharacter />
        )}
        {isBroken && !character3DEnabled && (
          <div className="wall-reveal-fallback" aria-label="Original character portrait">
            <span>PORTFOLIO</span>
            <strong>3D</strong>
          </div>
        )}
        <div className="wall-reveal-copy">
          <span className="wall-reveal-kicker">ORIGINAL MODEL</span>
          <span className="wall-reveal-subtitle">3D portrait</span>
        </div>
      </div>

      <div className="wall-surface" aria-hidden="true">
        {strikes > 0 && (
          <svg
            className="wall-cracks"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M48 0 52 16 43 27 55 38 47 51 58 63 48 76 54 88 47 100" />
            {strikes >= 2 && <path d="m45 29-17-7-10 5" />}
            {strikes >= 3 && <path d="m53 39 15-3 9 8" />}
            {strikes >= 4 && <path d="m48 52-14 6-8 12" />}
            {strikes >= 5 && <path d="m53 64 16 6 8 11" />}
          </svg>
        )}
      </div>

      {isBroken && (
        <div className="wall-debris" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      )}

      {!isBroken && (
        <button
          type="button"
          onClick={handleStrike}
          aria-label={`Slash the wall, ${strikes} of ${wallStrength} strikes`}
          className="wall-hit-area absolute inset-0 z-10 flex flex-col items-center justify-between p-6 text-center"
        >
          <span className="wall-game-label">SEALED AREA</span>
          <span className="wall-game-prompt">
            Tap to slash the wall
          </span>
        </button>
      )}

      {slash.id > 0 && !isBroken && (
        <svg
          key={slash.id}
          className="wall-slash"
          style={{ left: `${slash.x}%`, top: `${slash.y}%` }}
          viewBox="0 0 120 48"
          aria-hidden="true"
        >
          <path d="M5 40 112 8" />
        </svg>
      )}

      {isBroken && (
        <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
          <button
            type="button"
            onClick={toggleCharacter3D}
            aria-pressed={character3DEnabled}
            className="rounded-lg border border-line bg-card/90 px-3 py-2 font-mono text-xs text-ink transition-colors hover:border-gold-deep"
          >
            3D: {character3DEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-lg border border-line bg-card/90 px-3 py-2 font-mono text-xs text-ink transition-colors hover:border-gold-deep"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
