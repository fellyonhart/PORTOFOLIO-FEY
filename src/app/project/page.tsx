import { projects } from '@/data/projects'
import { profile } from '@/data/profile'
import TechIcon from '@/components/common/TechIcon'

export default function ProjectPage() {
  const featured = [...projects].reverse().filter((p) => p.featured !== false)
  const archived = [...projects].reverse().filter((p) => p.featured === false)

  return (
    <section className="mx-auto max-w-5xl py-12">
      <p className="text-ice mb-4 font-mono text-xs uppercase tracking-[0.2em]">
        {'// projects'}
      </p>
      <h1 className="mb-3 text-3xl font-bold text-ink md:text-5xl">
        {profile.headings.projects}
      </h1>
      <p className="mb-12 max-w-xl text-sm text-muted">
        A selection of things I&apos;ve built — from side projects to client
        work.
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
    <article className="card-hover border-line-2 bg-bg-2 group flex flex-col rounded-lg border p-6">
      {/* Type badge */}
      <span className="text-ice/70 mb-4 self-start font-mono text-xs">
        {project.type?.toLowerCase() ?? 'project'}
      </span>

      {/* Title */}
      <h2 className="group-hover:text-ice mb-2 text-lg font-bold text-ink transition-colors">
        {project.title}
      </h2>

      {/* Description */}
      {project.description && (
        <p className="mb-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {project.description}
        </p>
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
      <div className="flex items-center gap-4 font-mono text-xs">
        {openHref && openHref !== 'none' && openHref !== project.repo && (
          <a
            href={openHref}
            target="_blank"
            rel="noreferrer"
            className="text-ice flex items-center gap-1 hover:underline"
          >
            Live Demo
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
          </a>
        )}
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer"
            className="hover:text-ice flex items-center gap-1 text-muted"
          >
            <i className="fa-brands fa-github text-xs" />
            Source
          </a>
        )}
        {project.year && (
          <span className="text-muted-2 ml-auto">{project.year}</span>
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
        <span className="text-muted-2 font-mono text-xs">{project.year}</span>
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
          className="hover:text-ice shrink-0 font-mono text-xs text-muted"
          aria-label={`Open ${project.title}`}
        >
          <i className="fa-solid fa-arrow-up-right-from-square" />
        </a>
      )}
    </div>
  )
}
