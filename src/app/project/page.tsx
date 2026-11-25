import Image from 'next/image'
import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import ProjectCarousel from '@/components/common/ProjectCarousel'
import type { Project } from '@/data/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | Fitra Pradipta',
  description: 'Featured web projects by Fitra Pradipta, including interactive experiences and practical applications.',
  openGraph: {
    title: 'Featured Projects',
    description: 'Selected web development projects and results.',
  },
}

export default function ProjectPage() {
  const featured = [...projects]
    .reverse()
    .filter((project) => project.featured !== false)
  const archived = [...projects]
    .reverse()
    .filter((project) => project.featured === false)

  return (
    <section className="mx-auto max-w-5xl py-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ice">
        {'// projects'}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-ink md:text-5xl">
        {profile.headings.projects}
      </h1>
      <p className="mb-12 max-w-xl text-sm text-muted">
        A selection of web projects covering interaction design, frontend
        development, persistence, and deployment.
      </p>

      <ProjectCarousel projects={featured} />

      {/* Archived list */}
      {archived.length > 0 && (
        <div className="mt-16">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest text-muted">
            other noteworthy
          </p>
          <div className="flex flex-col divide-y divide-line">
            {archived.map((project, i) => (
              <ArchiveRow key={i} project={project} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function ArchiveRow({ project }: { project: Project }) {
  const href =
    project.demo && project.demo !== 'none' ? project.demo : project.repo

  return (
    <div className="project-row flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-4">
        {project.image && (
          <Image
            src={project.image}
            alt=""
            width={56}
            height={40}
            unoptimized
            className="h-10 w-14 shrink-0 rounded-md border border-line object-cover"
          />
        )}
        <span className="font-mono text-xs text-muted-2">{project.year}</span>
        <span className="text-sm font-semibold text-ink">{project.title}</span>
        {project.tech?.slice(0, 3).map((t) => (
          <span
            key={t}
            className="hidden font-mono text-xs text-muted sm:inline"
          >
            {t}
          </span>
        ))}
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 font-mono text-xs text-muted hover:text-ice"
          aria-label={`Open ${project.title}`}
        >
          <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      )}
    </div>
  )
}
