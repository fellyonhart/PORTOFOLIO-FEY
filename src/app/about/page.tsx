
import Image from 'next/image'
import ExperienceTimeline from '@/components/common/ExperienceTimeline'
import TechIcon from '@/components/common/TechIcon'
import { experience } from '@/data/experience'
import { profile } from '@/data/profile'
import { skills } from '@/data/skills'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Fitra Pradipta',
  description: 'Learn about Fitra Pradipta, PPLG student and software developer focused on modern web development.',
  openGraph: {
    title: 'About Fitra Pradipta',
    description: 'PPLG student, software developer, and web enthusiast.',
  },
}

export default function About() {
  return (
    <section className="mx-auto max-w-5xl space-y-24 py-12 text-ink">
      {/* ── Bio ── */}
      <div data-section-reveal>
        <p className="text-ice mb-4 font-mono text-xs uppercase tracking-[0.2em]">
          {'// about me'}
        </p>
        <h1 className="mb-10 text-3xl font-bold md:text-5xl">
          {profile.headings.about}
        </h1>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Photo */}
          <div className="relative mx-auto w-full max-w-xs">
            <div className="bg-ice absolute inset-0 rounded-2xl opacity-10 blur-2xl" />
            <div className="border-line-2 bg-bg-2 relative overflow-hidden rounded-2xl border">
              <Image
                src="/me.png"
                alt={profile.name}
                width={300}
                height={300}
                sizes="(min-width: 1024px) 320px, 100vw"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="flex flex-col justify-center gap-5">
            <div className="border-ice/30 space-y-4 border-l-2 pl-5 text-muted">
              {profile.biography.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed md:text-base">
                  {para.map(({ text, emphasis }, j) =>
                    emphasis ? (
                      <span key={j} className="font-semibold text-ink">
                        {text}
                      </span>
                    ) : (
                      text
                    ),
                  )}
                </p>
              ))}
            </div>

            {/* Quick facts */}
            <div className="border-line-2 bg-bg-2 mt-4 rounded-lg border p-4">
              <p className="text-ice mb-3 font-mono text-xs uppercase tracking-widest">
                quick facts
              </p>
              <ul className="space-y-2">
                {[
                  ['location', profile.location ?? 'Indonesia'],
                  ['studying', 'PPLG, SMK Wikrama Bogor'],
                  ['focus', 'Web & Android Development'],
                  ['status', 'Open to new opportunities'],
                  ['since', profile.startYear?.toString() ?? '2022'],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-3 font-mono text-xs">
                    <span className="text-ice shrink-0">{k}</span>
                    <span className="text-muted-2">→</span>
                    <span className="text-muted">{v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ── Experience ── */}
      <div data-section-reveal>
        <p className="text-ice mb-4 font-mono text-xs uppercase tracking-[0.2em]">
          {'// experience'}
        </p>
        <h2 className="mb-10 text-2xl font-bold md:text-4xl">
          {profile.headings.experience}
        </h2>
        <div className="mx-auto max-w-2xl">
          {[...experience].reverse().map((item, index, arr) => (
            <ExperienceTimeline
              key={index}
              isLast={index === arr.length - 1}
              isSingle={arr.length === 1}
              {...item}
            />
          ))}
        </div>
      </div>

      {/* ── Skills ── */}
      <div data-section-reveal>
        <p className="text-ice mb-4 font-mono text-xs uppercase tracking-[0.2em]">
          {'// skills'}
        </p>
        <h2 className="mb-10 text-2xl font-bold md:text-4xl">
          {profile.headings.skills}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Languages */}
          <SkillGroup
            category="Languages"
            items={['JavaScript', 'TypeScript', 'Python', 'C++']}
            allSkills={skills}
          />
          {/* Frameworks */}
          <SkillGroup
            category="Frameworks"
            items={[
              'React',
              'NextJS',
              'Express',
              'NodeJS',
            ]}
            allSkills={skills}
          />
          {/* Tools */}
          <SkillGroup
            category="Tools & Data"
            items={[
              'Tailwinds',
              'Framer',
              'SQLite',
              'MongoDB',
            ]}
            allSkills={skills}
          />
          <SkillGroup
            category="Animation & Build"
            items={['GSAP', 'Lenis', 'Vite']}
            allSkills={skills}
          />
        </div>
      </div>
    </section>
  )
}

function SkillGroup({
  category,
  items,
  allSkills,
}: {
  category: string
  items: string[]
  allSkills: { name: string }[]
}) {
  const filtered = allSkills.filter((s) => items.includes(s.name))

  return (
    <div className="border-line-2 bg-bg-2 rounded-lg border p-5">
      <p className="text-ice mb-4 font-mono text-xs uppercase tracking-widest">
        {category}
      </p>
      <div className="flex flex-wrap gap-2">
        {filtered.map(({ name }) => (
          <span key={name} className="tech-badge">
            <TechIcon name={name} />
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
