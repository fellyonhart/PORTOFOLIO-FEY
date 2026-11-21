import { FaGithub } from 'react-icons/fa6'
import { profile } from '@/data/profile'

export default function GithubStar() {
  return (
    <div className="fixed left-6 top-3 z-10 hidden items-center space-x-3 md:flex">
      <a
        href={profile.repository.href}
        target="_blank"
        rel="noreferrer"
        className="gradient-frame flex h-14 cursor-pointer flex-row items-center rounded-lg border border-line bg-card px-3 text-ink shadow-soft transition-colors duration-150 hover:text-gold-deep md:right-16"
      >
        <FaGithub className="mr-2 text-2xl" />
        <span className="text-sm font-bold">{profile.repository.name}</span>
      </a>
    </div>
  )
}
