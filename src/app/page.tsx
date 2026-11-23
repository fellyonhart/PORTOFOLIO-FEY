import Link from 'next/link'
import GreetingHand from '@/components/common/GreetingHand'
import WallBreakGame from '@/components/common/WallBreakGame'
import { profile } from '@/data/profile'

export default function Home() {
  return (
    <section className="relative grid min-h-[calc(100svh-8rem)] w-full grid-cols-1 items-center gap-10 px-2 py-12 sm:px-6 md:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)] md:gap-8 md:px-10 lg:px-12">
      <div className="relative z-10 flex max-w-2xl flex-col gap-6">
        <p className="bg-card/60 w-fit rounded-full border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Welcome to my portfolio
        </p>

        <div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl">
            {profile.greeting} <GreetingHand />
          </h1>
          <h2 className="mt-4 text-lg font-semibold text-muted sm:text-xl md:text-2xl">
            <span className="text-ink">Software Developer</span>{' '}
            <span aria-hidden="true">·</span> Web &amp; Full-Stack
          </h2>
        </div>

        <p className="max-w-xl text-sm leading-7 text-muted md:text-base">
          {profile.introduction.map(({ text, emphasis }, i) =>
            emphasis ? (
              <span key={i} className="font-semibold text-ink">
                {text}
              </span>
            ) : (
              <span key={i}>{text}</span>
            ),
          )}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/resume"
            aria-label="View resume"
            className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-muted shadow-soft"
          >
            <i className="fa-solid fa-file-lines text-xs" aria-hidden="true" />
            <span className="text-sm font-semibold">View Resume</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center gap-2 rounded-xl border border-line bg-card px-4 py-3 text-ink shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-gold-deep hover:text-gold-deep"
          >
            <i className="fa-solid fa-user text-xs" />
            <span className="text-sm font-semibold">
              {profile.actions.about}
            </span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-sm md:max-w-none">
        <WallBreakGame />
      </div>

      <div className="absolute bottom-5 left-7 hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted sm:flex md:left-10">
        <span>scroll to explore</span>
        <span className="scroll-indicator">↓</span>
      </div>
    </section>
  )
}
