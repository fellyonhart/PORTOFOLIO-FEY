import {
  SiAdonisjs,
  SiCplusplus,
  SiExpress,
  SiFramer,
  SiGo,
  SiJavascript,
  SiJest,
  SiJetpackcompose,
  SiKotlin,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si'
import type { IconType } from 'react-icons'

const technologyIcons: Record<string, IconType> = {
  adonisjs: SiAdonisjs,
  compose: SiJetpackcompose,
  cpp: SiCplusplus,
  express: SiExpress,
  framer: SiFramer,
  framermotion: SiFramer,
  go: SiGo,
  golang: SiGo,
  javascript: SiJavascript,
  jest: SiJest,
  jetpackcompose: SiJetpackcompose,
  kotlin: SiKotlin,
  laravel: SiLaravel,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  php: SiPhp,
  postgresql: SiPostgresql,
  python: SiPython,
  react: SiReact,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  tailwinds: SiTailwindcss,
  typescript: SiTypescript,
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
