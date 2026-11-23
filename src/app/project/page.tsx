import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import TechIcon from '@/components/common/TechIcon'
import Image from 'next/image'
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
  const featured = [...projects].reverse().filter((p) => p.featured !== false)
  const archived = [...projects].reverse().filter((p) => p.featured === false)

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

      {/* Featured grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {featured.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>

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

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const openHref =
    project.demo && project.demo !== 'none' ? project.demo : project.repo

  return (
    <article className="card-hover group flex flex-col rounded-lg border border-line-2 bg-bg-2 p-4 sm:p-6">
      {/* Type badge */}
      <span className="text-ice/70 mb-4 self-start font-mono text-xs">
        {project.type?.toLowerCase() ?? 'project'}
      </span>

      {project.demo && project.image && (
        <a
          href={project.demo}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${project.title} demo`}
          className="mb-5 block overflow-hidden rounded-lg border border-line"
        >
          <Image
            src={project.image}
            alt={`${project.title} website preview`}
            width={1000}
            height={650}
            unoptimized
            className="aspect-[16/10] w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>
      )}

      {/* Title */}
      <h2 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-ice">
        {project.title}
      </h2>

      {/* Description */}
      {project.description && (
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
      )}

      {(project.contribution || project.result) && (
        <dl className="mb-5 space-y-2 border-l border-line-2 pl-3">
          {project.contribution && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-ice">Contribution</dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted">{project.contribution}</dd>
            </div>
          )}
          {project.result && (
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-widest text-ice">Result</dt>
              <dd className="mt-1 text-xs leading-relaxed text-muted">{project.result}</dd>
            </div>
          )}
        </dl>
      )}

      {/* Tech stack */}
      {project.tech && project.tech.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="tech-badge">
              <TechIcon name={t} />
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {openHref && openHref !== 'none' && openHref !== project.repo && (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-ice px-3 py-2 font-semibold text-ice transition-colors hover:bg-ice hover:text-bg"
          >
            Demo
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-9 items-center gap-2 rounded-md border border-line px-3 py-2 font-semibold text-muted transition-colors hover:border-ice hover:text-ice"
          >
            <i className="fa-brands fa-github text-xs" />
            Source Code
          </a>
        )}
        {project.year && (
          <span className="ml-auto text-muted-2">{project.year}</span>
        )}
      </div>
    </article>
  )
}

function ArchiveRow({ project }: { project: (typeof projects)[number] }) {
  const href =
    project.demo && project.demo !== 'none' ? project.demo : project.repo

  return (
    <div className="project-row flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-4">
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
