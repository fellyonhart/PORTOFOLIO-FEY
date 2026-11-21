'use client'

import { useState, useEffect, useCallback } from 'react'

interface LoadingScreenProps {
  onComplete?: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'slash' | 'ready' | 'exit'>('slash')
  const [slashStep, setSlashStep] = useState(0)
  const [isDark, setIsDark] = useState(true)

  // Detect theme
  useEffect(() => {
    const sync = () => {
      const html = document.documentElement
      setIsDark(
        html.classList.contains('dark') ||
          (!html.classList.contains('light') &&
            window.matchMedia('(prefers-color-scheme: dark)').matches),
      )
    }
    sync()
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', sync)
    return () => {
      mo.disconnect()
      mq.removeEventListener('change', sync)
    }
  }, [])

  // Sword slash sequence: 4 slashes then reveal
  useEffect(() => {
    if (phase !== 'slash') return
    if (slashStep < 4) {
      const t = setTimeout(() => setSlashStep((s) => s + 1), 420)
      return () => clearTimeout(t)
    }
    // After 4 slashes, show ready screen
    const t = setTimeout(() => setPhase('ready'), 300)
    return () => clearTimeout(t)
  }, [phase, slashStep])

  const handleEnter = useCallback(() => {
    if (phase !== 'ready') return
    setPhase('exit')
    setTimeout(() => onComplete?.(), 700)
  }, [phase, onComplete])

  useEffect(() => {
    const onKey = () => handleEnter()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleEnter])

  const bg = isDark
    ? 'linear-gradient(135deg, #151512 0%, #1d1d19 100%)'
    : 'linear-gradient(135deg, #e9e6dc 0%, #dedacd 100%)'
  const sep = isDark ? 'rgba(207,199,175,0.25)' : 'rgba(41,41,35,0.14)'
  const lbl = isDark ? '#d7d0bc' : '#665832'
  const sub = isDark ? '#b4ad9b' : '#686659'
  const foot = isDark ? '#817b6e' : '#928d7c'

  return (
    <div
      onClick={handleEnter}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-inter, system-ui, sans-serif)',
        overflow: 'hidden',
        cursor: phase === 'ready' ? 'pointer' : 'default',
        transition: phase === 'exit' ? 'opacity 0.6s ease' : 'none',
        opacity: phase === 'exit' ? 0 : 1,
      }}
    >
      <style>{`
        /* ── Scanlines ── */
        .ls-scan::before{content:'';position:absolute;inset:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.06) 2px,rgba(0,0,0,.06) 4px);
          pointer-events:none;z-index:1}
        .ls-scan::after{content:'';position:absolute;inset:0;
          background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.3) 100%);
          pointer-events:none;z-index:1}

        /* ── Slash container ── */
        .ls-slash-wrap{
          position:relative; width:280px; height:280px;
          display:flex; align-items:center; justify-content:center;
        }

        /* ── Sword SVG ── */
        .ls-sword{
          position:absolute;
          width:180px; height:180px;
          transform-origin:center center;
        }
        .ls-sword-idle{
          animation:sword-idle 2s ease-in-out infinite;
        }
        @keyframes sword-idle{
          0%,100%{transform:rotate(-10deg) translateY(0)}
          50%{transform:rotate(-10deg) translateY(-6px)}
        }

        /* ── Slash trail lines ── */
        .ls-trail{
          position:absolute; inset:0;
          pointer-events:none;
        }
        .ls-trail svg{ width:100%; height:100%; }

        /* ── Individual slash animations ── */
        .slash-1{animation:slash1 0.35s ease-out forwards}
        .slash-2{animation:slash2 0.35s ease-out forwards}
        .slash-3{animation:slash3 0.35s ease-out forwards}
        .slash-4{animation:slash4 0.35s ease-out forwards}

        @keyframes slash1{
          0%{opacity:1;transform:scaleX(0) rotate(-40deg);transform-origin:left center}
          60%{opacity:1;transform:scaleX(1) rotate(-40deg);transform-origin:left center}
          100%{opacity:0;transform:scaleX(1) rotate(-40deg);transform-origin:left center}
        }
        @keyframes slash2{
          0%{opacity:1;transform:scaleX(0) rotate(20deg);transform-origin:right center}
          60%{opacity:1;transform:scaleX(1) rotate(20deg);transform-origin:right center}
          100%{opacity:0;transform:scaleX(1) rotate(20deg);transform-origin:right center}
        }
        @keyframes slash3{
          0%{opacity:1;transform:scaleX(0) rotate(-15deg);transform-origin:left center}
          60%{opacity:1;transform:scaleX(1) rotate(-15deg);transform-origin:left center}
          100%{opacity:0;transform:scaleX(1) rotate(-15deg);transform-origin:left center}
        }
        @keyframes slash4{
          0%{opacity:1;transform:scaleX(0) rotate(5deg);transform-origin:center center}
          60%{opacity:1;transform:scaleX(1) rotate(5deg);transform-origin:center center}
          100%{opacity:0.3;transform:scaleX(1.1) rotate(5deg);transform-origin:center center}
        }

        /* ── Impact flash ── */
        .ls-flash{
          position:absolute; inset:0; border-radius:50%;
          background:radial-gradient(circle, rgba(202,187,142,0.35) 0%, transparent 70%);
          animation:flash-out 0.4s ease-out forwards;
        }
        @keyframes flash-out{
          0%{opacity:1;transform:scale(0.3)}
          100%{opacity:0;transform:scale(1.8)}
        }

        /* ── Sword swing animation per step ── */
        .sword-swing-1{animation:swing1 0.35s ease-out forwards}
        .sword-swing-2{animation:swing2 0.35s ease-out forwards}
        .sword-swing-3{animation:swing3 0.35s ease-out forwards}
        .sword-swing-4{animation:swing4 0.3s ease-out forwards}

        @keyframes swing1{
          0%{transform:rotate(-60deg) scale(1.1)}
          50%{transform:rotate(20deg) scale(1.2)}
          100%{transform:rotate(-10deg) scale(1)}
        }
        @keyframes swing2{
          0%{transform:rotate(40deg) scale(1.1)}
          50%{transform:rotate(-30deg) scale(1.2)}
          100%{transform:rotate(-10deg) scale(1)}
        }
        @keyframes swing3{
          0%{transform:rotate(-50deg) scale(1.1)}
          50%{transform:rotate(10deg) scale(1.2)}
          100%{transform:rotate(-10deg) scale(1)}
        }
        @keyframes swing4{
          0%{transform:rotate(-10deg) scale(1)}
          30%{transform:rotate(5deg) scale(1.3)}
          100%{transform:rotate(-10deg) scale(1)}
        }

        /* ── Reveal screen ── */
        .ls-reveal{
          display:flex; flex-direction:column; align-items:center;
          animation:fade-up 0.5s ease-out forwards;
        }
        @keyframes fade-up{
          from{opacity:0;transform:translateY(16px)}
          to{opacity:1;transform:translateY(0)}
        }

        /* ── PRESS ANY KEY blink ── */
        .ls-blink{animation:ls-blink 1s step-end infinite}
        @keyframes ls-blink{0%,49%{opacity:1}50%,100%{opacity:0}}

        /* ── Glitch text ── */
        .ls-glitch{position:relative;display:inline-block}
        .ls-ga,.ls-gb{position:absolute;top:0;left:0;width:100%;opacity:0}
        .ls-rdy .ls-ga{opacity:.6;color:#d7d0bc;animation:ls-g1 2.5s steps(1) infinite}
        .ls-rdy .ls-gb{opacity:.5;color:#aaa38f;animation:ls-g2 3.1s steps(1) infinite}
        @keyframes ls-g1{
          0%{clip-path:inset(40% 0 61% 0);transform:translate(-4px,0)}
          20%{clip-path:inset(92% 0 1% 0);transform:translate(3px,0)}
          60%{clip-path:inset(25% 0 58% 0);transform:translate(4px,0)}
          100%{clip-path:inset(58% 0 43% 0);transform:translate(0,0)}
        }
        @keyframes ls-g2{
          0%{clip-path:inset(24% 0 29% 0);transform:translate(4px,0)}
          50%{clip-path:inset(80% 0 5% 0);transform:translate(0,0)}
          100%{clip-path:inset(18% 0 73% 0);transform:translate(-4px,0)}
        }

        /* ── Gradient bar ── */
        @keyframes bar-fill{from{width:0%}to{width:100%}}
        .bar-fill{animation:bar-fill 1.7s cubic-bezier(.4,0,.2,1) forwards}
      `}</style>

      {/* Scanlines overlay */}
      <div
        className="ls-scan"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${sep}`,
          paddingBottom: 10,
        }}
      >
        <span
          style={{
            color: lbl,
            fontSize: 11,
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          WELCOME
        </span>
        <span style={{ color: sub, fontSize: 11 }}>Fullstack Developer</span>
      </div>

      {/* ── SLASH PHASE ── */}
      {phase === 'slash' && (
        <div className="ls-slash-wrap">
          {/* Flash on each hit */}
          {slashStep > 0 && <div className="ls-flash" key={slashStep} />}

          {/* Sword SVG */}
          <svg
            viewBox="0 0 100 100"
            className={`ls-sword ${
              slashStep === 0
                ? 'ls-sword-idle'
                : slashStep === 1
                  ? 'sword-swing-1'
                  : slashStep === 2
                    ? 'sword-swing-2'
                    : slashStep === 3
                      ? 'sword-swing-3'
                      : 'sword-swing-4'
            }`}
            style={{ zIndex: 2 }}
          >
            {/* Blade */}
            <polygon
              points="50,8 54,45 50,52 46,45"
              fill="url(#blade-grad)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
            />
            {/* Blade edge highlight */}
            <line
              x1="50"
              y1="10"
              x2="52"
              y2="44"
              stroke="rgba(255,255,255,0.7)"
              strokeWidth="0.4"
              strokeLinecap="round"
            />
            {/* Guard */}
            <rect
              x="43"
              y="50"
              width="14"
              height="4"
              rx="1"
              fill="#a99869"
              stroke="#cabb8e"
              strokeWidth="0.5"
            />
            {/* Grip */}
            <rect
              x="47"
              y="54"
              width="6"
              height="22"
              rx="1.5"
              fill="#4a4435"
              stroke="#6f6240"
              strokeWidth="0.5"
            />
            {/* Grip wrapping */}
            {[57, 61, 65, 69].map((y) => (
              <line
                key={y}
                x1="47"
                y1={y}
                x2="53"
                y2={y}
                stroke="#a99869"
                strokeWidth="0.8"
                strokeLinecap="round"
              />
            ))}
            {/* Pommel */}
            <ellipse
              cx="50"
              cy="78"
              rx="4"
              ry="3"
              fill="#a99869"
              stroke="#cabb8e"
              strokeWidth="0.5"
            />

            {/* Gradient def */}
            <defs>
              <linearGradient id="blade-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#aaa38f" />
                <stop offset="40%" stopColor="#e8e4d8" />
                <stop offset="100%" stopColor="#d7d0bc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Slash trails */}
          <div className="ls-trail">
            {slashStep >= 1 && (
              <svg viewBox="0 0 280 280" key={`s1-${slashStep}`}>
                <line
                  x1="30"
                  y1="200"
                  x2="250"
                  y2="80"
                  stroke="url(#slash-grad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="slash-1"
                />
                <line
                  x1="35"
                  y1="205"
                  x2="255"
                  y2="85"
                  stroke="rgba(202,187,142,0.3)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="slash-1"
                />
                <defs>
                  <linearGradient id="slash-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#d7d0bc" stopOpacity="0" />
                    <stop offset="50%" stopColor="#e8e4d8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#cabb8e" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            )}
            {slashStep >= 2 && (
              <svg
                viewBox="0 0 280 280"
                style={{ position: 'absolute', inset: 0 }}
                key={`s2-${slashStep}`}
              >
                <line
                  x1="250"
                  y1="200"
                  x2="30"
                  y2="90"
                  stroke="url(#slash-grad2)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="slash-2"
                />
                <defs>
                  <linearGradient id="slash-grad2" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0%" stopColor="#aaa38f" stopOpacity="0" />
                    <stop offset="50%" stopColor="#e8e4d8" stopOpacity="1" />
                    <stop offset="100%" stopColor="#d7d0bc" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
            )}
            {slashStep >= 3 && (
              <svg
                viewBox="0 0 280 280"
                style={{ position: 'absolute', inset: 0 }}
                key={`s3-${slashStep}`}
              >
                <line
                  x1="20"
                  y1="150"
                  x2="260"
                  y2="130"
                  stroke="url(#slash-grad3)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="slash-3"
                />
                <defs>
                  <linearGradient id="slash-grad3" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#e4dece" stopOpacity="0" />
                    <stop offset="50%" stopColor="#e8e4d8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#aaa38f" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            )}
            {slashStep >= 4 && (
              <svg
                viewBox="0 0 280 280"
                style={{ position: 'absolute', inset: 0 }}
                key={`s4-${slashStep}`}
              >
                <line
                  x1="60"
                  y1="60"
                  x2="220"
                  y2="220"
                  stroke="url(#slash-grad4)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="slash-4"
                />
                <line
                  x1="65"
                  y1="58"
                  x2="225"
                  y2="218"
                  stroke="rgba(202,187,142,0.4)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="slash-4"
                />
                <defs>
                  <linearGradient id="slash-grad4" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#cabb8e" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#fff8e6" stopOpacity="1" />
                    <stop offset="100%" stopColor="#d7d0bc" stopOpacity="0.4" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>

          {/* Step counter */}
          <div
            style={{
              position: 'absolute',
              bottom: -32,
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10,
              color: sub,
              letterSpacing: '0.15em',
            }}
          >
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  margin: '0 3px',
                  borderRadius: '50%',
                  background: i < slashStep ? '#cabb8e' : sep,
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── READY PHASE ── */}
      {phase === 'ready' && (
        <div
          className="ls-reveal ls-rdy"
          style={{
            maxWidth: 420,
            width: '100%',
            padding: '0 24px',
            alignItems: 'center',
          }}
        >
          {/* Sword small icon */}
          <svg
            viewBox="0 0 100 100"
            style={{ width: 64, height: 64, marginBottom: 20 }}
          >
            <polygon
              points="50,8 54,45 50,52 46,45"
              fill="url(#blade-grad-sm)"
            />
            <rect x="43" y="50" width="14" height="4" rx="1" fill="#a99869" />
            <rect x="47" y="54" width="6" height="22" rx="1.5" fill="#4a4435" />
            <ellipse cx="50" cy="78" rx="4" ry="3" fill="#a99869" />
            <defs>
              <linearGradient id="blade-grad-sm" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#aaa38f" />
                <stop offset="50%" stopColor="#e8e4d8" />
                <stop offset="100%" stopColor="#d7d0bc" />
              </linearGradient>
            </defs>
          </svg>

          {/* Progress bar — full already */}
          <div
            style={{
              width: '100%',
              height: 3,
              background: sep,
              borderRadius: 2,
              overflow: 'hidden',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                height: '100%',
                width: '100%',
                background:
                  'linear-gradient(115deg,#817a67 0%,#b4ad9b 30%,#e8e4d8 52%,#d3c7a2 75%,#a89a70 100%)',
              }}
            />
          </div>

          {/* Press any key */}
          <div className="ls-glitch ls-blink">
            <span
              style={{
                color: isDark ? '#d7d0bc' : '#292923',
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              — PRESS ANY KEY TO ENTER —
            </span>
            <span
              className="ls-ga"
              style={{
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              — PRESS ANY KEY TO ENTER —
            </span>
            <span
              className="ls-gb"
              style={{
                fontSize: 13,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              — PRESS ANY KEY TO ENTER —
            </span>
          </div>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 420,
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          borderTop: `1px solid ${sep}`,
          paddingTop: 10,
        }}
      >
        <span
          style={{
            color: foot,
            fontSize: 10,
            letterSpacing: '0.08em',
            fontFamily: 'monospace',
          }}
        >
          © 2026 Fitra Pradipta
        </span>
        <span
          style={{
            color: foot,
            fontSize: 10,
            letterSpacing: '0.08em',
            fontFamily: 'monospace',
          }}
        >
          INDONESIA
        </span>
      </div>
    </div>
  )
}
