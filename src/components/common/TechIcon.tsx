import {
  SiCplusplus,
  SiExpress,
  SiFramer,
  SiJavascript,
  SiJetpackcompose,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

const technologyIcons: Record<string, IconType> = {
  compose: SiJetpackcompose,
  cpp: SiCplusplus,
  express: SiExpress,
  framer: SiFramer,
  framermotion: SiFramer,
  javascript: SiJavascript,
  jetpackcompose: SiJetpackcompose,
  mongodb: SiMongodb,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  python: SiPython,
  react: SiReact,
  sqlite: SiSqlite,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  tailwinds: SiTailwindcss,
  typescript: SiTypescript,
  vite: SiVite,
}

export default function TechIcon({ name }: { name: string }) {
  const key =
    name.toLowerCase() === 'c++'
      ? 'cpp'
      : name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const Icon = technologyIcons[key]

  return Icon ? (
    <Icon aria-hidden="true" className="shrink-0 text-muted" size={14} />
  ) : null
}
