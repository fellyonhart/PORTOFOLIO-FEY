'use client'

import { useState } from 'react'
import EndOfLine from '@/components/common/EndOfLine'
import ProjectCard from '@/components/common/ProjectCard'
import { projects } from '@/data/projects'
import { sectionLabels } from '@/data/site'
import type { Project } from '@/data/types'

type ProjectFilter = 'all' | 'web' | 'mobile' | 'api'

const filters: ProjectFilter[] = ['all', 'web', 'mobile', 'api']
const listHeaderClass =
  'mb-2 flex items-baseline justify-between gap-4 border-b border-line pb-3 font-mono text-xs font-medium tracking-[0.12em] text-muted'

function formatNumber(number: number) {
  return String(number).padStart(2, '0')
}

function matchesFilter(project: Project, filter: ProjectFilter) {
  if (filter === 'all') return true
  if (filter === 'mobile')
    return ['android', 'ios', 'flutter', 'mobile'].includes(
      project.type?.toLowerCase() ?? '',
    )
  return project.type?.toLowerCase() === filter
}

function getOpenHref(project: Project) {
  return project.demo && project.demo !== 'none' ? project.demo : project.repo
}

export default function ProjectBrowser() {
  const [filter, setFilter] = useState<ProjectFilter>('all')
  const visibleProjects = projects
    .slice()
    .reverse()
    .filter((project) => matchesFilter(project, filter))
  const featuredProjects = visibleProjects.filter(
    (project) => project.featured !== false,
  )
  const archivedProjects = visibleProjects.filter(
    (project) => project.featured === false,
  )

  return (
    <>
      <div className="my-4 flex flex-wrap justify-center gap-4 font-semibold text-muted sm:gap-6 md:gap-8 lg:gap-4">
        {filters.map((name) => {
          const count = projects.filter((project) =>
            matchesFilter(project, name),
          ).length

          return (
            <button
              key={name}
              type="button"
              onClick={() => setFilter(name)}
              aria-pressed={filter === name}
              className="group relative flex cursor-pointer flex-col items-start justify-center text-ink"
            >
              <span
                className={`absolute bottom-0 h-1 rounded-md ${
                  filter === name
                    ? 'w-full bg-shift'
                    : 'w-0 bg-line group-hover:w-full'
                }`}
              />
              <span>
                {name === 'api' ? 'Api' : name[0].toUpperCase() + name.slice(1)}
                {filter === name && ` (${count})`}
              </span>
            </button>
          )
        })}
      </div>
      <div className="mx-auto mt-10 w-full max-w-5xl">
        <div className={listHeaderClass}>
          <h2 className="uppercase tracking-[0.18em]">Featured</h2>
          <p>
            {featuredProjects.length > 0
              ? `01 / ${formatNumber(featuredProjects.length)}`
              : '00 / 00'}
          </p>
        </div>
        <ol className="flex flex-col gap-1">
          {featuredProjects.map((project, index) => (
            <ProjectCard
              key={`${project.title ?? 'project'}-${index}`}
              project={project}
              number={formatNumber(index + 1)}
              openHref={getOpenHref(project)}
            />
          ))}
        </ol>
        {archivedProjects.length > 0 && (
          <>
            <div className={`${listHeaderClass} mt-16`}>
              <h2 className="uppercase tracking-[0.18em]">
                {sectionLabels.additionalWorks}
              </h2>
              <p>{formatNumber(archivedProjects.length)} Entries</p>
            </div>
            <p className="mb-2 text-sm text-muted">
              More? here&apos;s the other projects.
            </p>
            <ol>
              {archivedProjects.map((project, index) => (
                <ArchiveRow
                  key={`${project.title ?? 'archive'}-${index}`}
                  project={project}
                  index={index}
                />
              ))}
            </ol>
          </>
        )}
        <EndOfLine />
      </div>
    </>
  )
}

function ArchiveRow({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  const openHref = getOpenHref(project)
  const rowClass =
    'project-row grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 border-b border-line py-3 text-ink md:grid-cols-[3rem_minmax(0,2fr)_minmax(0,1fr)_3rem] md:gap-x-5'
  const content = (
    <>
      <span className="font-mono text-xs text-muted">
        {formatNumber(index + 1)}
      </span>
      <span className="min-w-0 break-words font-medium">
        {project.title}
        {openHref && <span aria-hidden="true"> ↗</span>}
      </span>
      <span className="hidden font-mono text-xs text-muted md:block">
        {project.type}
      </span>
      <span className="text-right font-mono text-xs text-muted">
        {project.year}
      </span>
    </>
  )

  return openHref ? (
    <li>
      <a
        href={openHref}
        target="_blank"
        rel="noreferrer"
        className={rowClass}
      >
        {content}
      </a>
    </li>
  ) : (
    <li className={rowClass}>{content}</li>
  )
}
