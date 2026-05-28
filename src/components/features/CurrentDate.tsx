"use client"

import { useEffect, useState } from "react"

export function CurrentDate({ className }: { className?: string }) {
  const [label, setLabel] = useState("")

  useEffect(() => {
    setLabel(
      new Intl.DateTimeFormat("de-DE", {
        weekday: "long",
        day:     "numeric",
        month:   "long",
        year:    "numeric",
      }).format(new Date())
    )
  }, [])

  if (!label) return null
  return <span className={className}>{label}</span>
}
