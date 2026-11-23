import { socials } from '@/data/socials'
import { profile } from '@/data/profile'
import SocialIcon from '@/components/common/SocialIcon'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Fitra Pradipta',
  description: 'Contact Fitra Pradipta for development opportunities and collaborations.',
  openGraph: {
    title: 'Contact Fitra Pradipta',
    description: 'Open to opportunities and collaborations.',
  },
}

export default function Contact() {
  const email =
    socials.find((s) => s.name === 'Gmail')?.href?.replace('mailto:', '') ?? ''

  return (
    <section className="mx-auto max-w-2xl py-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ice">
        {'// contact'}
      </p>
      <h1 className="mb-5 text-3xl font-bold text-ink md:text-5xl">
        {profile.headings.contact}
      </h1>
      <p className="mb-10 text-sm leading-relaxed text-muted md:text-base">
        I&apos;m currently open to new opportunities — full-time, freelance, or
        interesting collaborations. My inbox is always open. Whether you have a
        question or just want to say hi, I&apos;ll do my best to get back to
        you.
      </p>

      {/* Say Hello CTA */}
      {email && (
        <a
          href={`mailto:${email}`}
          className="mb-14 inline-flex items-center gap-3 rounded border border-ice bg-ice px-6 py-3 font-mono text-sm font-bold text-bg transition-all hover:bg-transparent hover:text-ice"
        >
          <i className="fa-solid fa-paper-plane" />
          Say Hello
        </a>
      )}

      {/* Divider */}
      <div className="mb-10 h-px bg-line" />

      {/* Social links grid */}
      <div data-section-reveal className="grid gap-3 sm:grid-cols-2">
        {socials
          .filter((s) => s.href)
          .map((s) => (
            <a
              key={s.name}
              href={s.href}
              target={s.href?.startsWith('mailto') ? undefined : '_blank'}
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-lg border border-line-2 bg-bg-2 px-5 py-4 transition-all hover:border-ice"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded border border-line-2 bg-bg text-muted transition-colors group-hover:border-ice group-hover:text-ice">
                <SocialIcon name={s.name} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                {s.content && (
                  <p className="font-mono text-xs text-muted">{s.content}</p>
                )}
              </div>
              <i className="fa-solid fa-arrow-right ml-auto text-xs text-muted transition-colors group-hover:text-ice" />
            </a>
          ))}
      </div>
    </section>
  )
}
