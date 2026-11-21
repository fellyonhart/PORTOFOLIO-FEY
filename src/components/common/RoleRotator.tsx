'use client'

import { useEffect, useState } from 'react'

export default function RoleRotator({ roles }: { roles: string[] }) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (roles.length === 0) return

    const role = roles[roleIndex % roles.length]
    const delay =
      !deleting && text === role
        ? 5000
        : deleting
          ? 45
          : 75

    const timer = window.setTimeout(() => {
      if (!deleting && text === role) {
        setDeleting(true)
      } else if (deleting && text.length === 0) {
        setDeleting(false)
        setRoleIndex((index) => (index + 1) % roles.length)
      } else {
        setText((current) =>
          deleting ? current.slice(0, -1) : role.slice(0, current.length + 1),
        )
      }
    }, delay)

    return () => window.clearTimeout(timer)
  }, [deleting, roleIndex, roles, text])

  if (roles.length === 0) return null

  return (
    <span className="inline-block">
      {text}
      <span className="role-caret" aria-hidden="true" />
    </span>
  )
}
