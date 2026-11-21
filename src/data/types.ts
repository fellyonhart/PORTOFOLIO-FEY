export type Profile = {
  name: string
  greeting: string
  roleLead: string
  roles: string[]
  status?: string
  location?: string
  startYear?: number
  introduction: ContentSegment[]
  biography: ContentSegment[][]
  actions: { about: string }
  repository: { name: string; href: string }
  headings: {
    about: string
    experience: string
    skills: string
    education: string
    projects: string
    contact: string
  }
}

export type ContentSegment = {
  text: string
  emphasis?: boolean
}

export type LocalIcon = `/icons/${string}`

export type Experience = {
  title?: string
  description?: string
  company?: string
  type?: 'work' | 'education'
  uri?: string
  logo?: LocalIcon
  date?: string
}

export type Education = {
  title?: string
  company?: string
  year?: string
  description?: string
  image?: `/certificates/${string}`
  href?: string
  type?: 'course' | 'competition' | 'competence' | 'self-study'
}

export type Certificate = {
  title: string
  issuer: string
  issuedAt?: string
  href?: string
  file: `/certificates/${string}`
}

export type Project = {
  title?: string
  image?: `/projects/${string}`
  description?: string
  type?: string
  tech?: string[]
  featured?: boolean
  year?: number
  demo?: string
  repo?: string
}

export type Skill = {
  name: string
}

export type Social = {
  name: string
  href?: string
  icon: LocalIcon
  content?: string
}
