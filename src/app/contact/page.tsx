import { socials } from '@/data/socials'
import { profile } from '@/data/profile'

export default function Contact() {
  const email =
    socials.find((s) => s.name === 'Gmail')?.href?.replace('mailto:', '') ?? ''

  return (
    <section className="mx-auto max-w-2xl py-12">
      <p className="text-ice mb-4 font-mono text-xs uppercase tracking-[0.2em]">
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
          className="border-ice bg-ice hover:text-ice mb-14 inline-flex items-center gap-3 rounded border px-6 py-3 font-mono text-sm font-bold text-bg transition-all hover:bg-transparent"
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
              className="border-line-2 bg-bg-2 hover:border-ice group flex items-center gap-4 rounded-lg border px-5 py-4 transition-all"
            >
              <span className="border-line-2 group-hover:border-ice group-hover:text-ice flex h-9 w-9 items-center justify-center rounded border bg-bg text-muted transition-colors">
                <SocialIcon name={s.name} />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{s.name}</p>
                {s.content && (
                  <p className="font-mono text-xs text-muted">{s.content}</p>
                )}
              </div>
              <i className="fa-solid fa-arrow-right group-hover:text-ice ml-auto text-xs text-muted transition-colors" />
            </a>
          ))}
      </div>
    </section>
  )
}

function SocialIcon({ name }: { name: string }) {
  const n = name.toLowerCase()
  if (n === 'github') return <i className="fa-brands fa-github" />
  if (n === 'linkedin') return <i className="fa-brands fa-linkedin" />
  if (n === 'instagram') return <i className="fa-brands fa-instagram" />
  if (n === 'twitter') return <i className="fa-brands fa-x-twitter" />
  if (n === 'gmail') return <i className="fa-solid fa-envelope" />
  if (n === 'discord') return <i className="fa-brands fa-discord" />
  if (n === 'telegram') return <i className="fa-brands fa-telegram" />
  return <i className="fa-solid fa-link" />
}
