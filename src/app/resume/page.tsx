import type { Metadata } from 'next'
import Link from 'next/link'
import { education } from '@/data/education'
import { experience } from '@/data/experience'
import { profile } from '@/data/profile'
import { skills } from '@/data/skills'

export const metadata: Metadata = {
  title: `Resume | ${profile.name}`,
  description: `Professional resume and selected learning experience for ${profile.name}, software developer and PPLG student.`,
}

export default function Resume() {
  return (
    <article className="mx-auto max-w-4xl py-12 text-ink">
      <header className="border-b border-line pb-8">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-ice">Resume</p>
        <h1 className="text-3xl font-bold md:text-5xl">{profile.name}</h1>
        <p className="mt-3 text-lg font-semibold text-muted">Software Developer · PPLG Student</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          Indonesia-based developer focused on accessible web experiences, frontend development, and practical full-stack applications.
        </p>
      </header>

      <div className="grid gap-10 py-10 md:grid-cols-[1fr_240px]">
        <div className="space-y-10">
          <section>
            <h2 className="mb-5 text-xl font-bold">Experience</h2>
            <div className="space-y-6">
              {[...experience].reverse().map((item) => (
                <div key={`${item.title}-${item.date}`} className="border-l border-line-2 pl-4">
                  <p className="font-mono text-xs text-muted">{item.date}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  <p className="text-sm text-ice">{item.company}</p>
                  {item.description && <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-5 text-xl font-bold">Education &amp; Learning</h2>
            <div className="space-y-5">
              {education.map((item) => (
                <div key={`${item.title}-${item.year}`} className="border-l border-line-2 pl-4">
                  <p className="font-mono text-xs text-muted">{item.year}</p>
                  <h3 className="mt-1 font-semibold">{item.title}</h3>
                  {item.description && <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside>
          <h2 className="mb-4 text-lg font-bold">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.name} className="tech-badge">{skill.name}</span>
            ))}
          </div>
          <Link href="/project" className="mt-6 inline-flex min-h-10 items-center rounded-md border border-ice px-4 py-2 font-mono text-xs font-semibold text-ice hover:bg-ice hover:text-bg">
            View Projects
          </Link>
        </aside>
      </div>
    </article>
  )
}
