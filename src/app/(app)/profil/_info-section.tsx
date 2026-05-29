"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProfile } from "@/lib/supabase/actions"

export function PersonalInfoSection({
  initialName,
  email,
  initialAvatarUrl,
}: {
  initialName: string
  email: string
  initialAvatarUrl: string | null
}) {
  const router = useRouter()
  const [editing, setEditing]     = useState(false)
  const [name, setName]           = useState(initialName)
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl ?? "")
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState<string | null>(null)

  // Displayed values update optimistically on save
  const [displayName, setDisplayName]         = useState(initialName)
  const [displayAvatarUrl, setDisplayAvatarUrl] = useState(initialAvatarUrl)

  async function handleSave() {
    setSaving(true)
    setError(null)
    const result = await updateProfile({
      fullName:  name.trim(),
      avatarUrl: avatarUrl.trim() || null,
    })
    setSaving(false)
    if (result.error) {
      setError(result.error)
      return
    }
    setDisplayName(name.trim())
    setDisplayAvatarUrl(avatarUrl.trim() || null)
    setEditing(false)
    router.refresh()
  }

  function handleCancel() {
    setName(displayName)
    setAvatarUrl(displayAvatarUrl ?? "")
    setError(null)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-6 py-6">
        {error && (
          <div className="mb-5 px-4 py-3 bg-[#FDF2F0] border border-[#E8C4BC] rounded-xl text-[13px] text-[#8A4A3C]">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
              className="w-full px-4 py-3 text-[14px] bg-white border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
              Profilbild-URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              disabled={saving}
              placeholder="https://…"
              className="w-full px-4 py-3 text-[14px] bg-white border border-[#E8E2D9] rounded-xl text-[#1A1714] placeholder:text-[#C4B9B0] focus:outline-none focus:ring-2 focus:ring-[#5B2D8E]/15 focus:border-[#5B2D8E]/30 transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-1.5">
              E-Mail
            </label>
            <p className="px-4 py-3 text-[14px] text-[#9E9188]">{email}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="px-5 py-2.5 bg-[#5B2D8E] text-white text-[13px] font-medium rounded-xl hover:bg-[#4A2478] transition-colors disabled:opacity-50"
          >
            {saving ? "Wird gespeichert …" : "Speichern"}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="text-[13px] font-medium text-[#6B5E52] hover:text-[#1A1714] transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-6">
      {/* Name */}
      <div className="flex items-center justify-between gap-3 py-4 border-b border-[#EDE8DF]">
        <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
            Name
          </span>
          <span className="text-[14px] text-[#1A1714] truncate min-w-0">{displayName}</span>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-[12px] text-[#5B2D8E] hover:text-[#4A2478] font-medium transition-colors shrink-0 ml-1"
        >
          Bearbeiten
        </button>
      </div>

      {/* Avatar URL — only show row if a URL is set */}
      {displayAvatarUrl && (
        <div className="flex items-center gap-3 py-4 border-b border-[#EDE8DF]">
          <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
            <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
              Bild
            </span>
            <span className="text-[14px] text-[#1A1714] truncate min-w-0">{displayAvatarUrl}</span>
          </div>
        </div>
      )}

      {/* E-Mail */}
      <div className="flex items-center justify-between gap-3 py-4">
        <div className="flex items-baseline gap-5 sm:gap-8 min-w-0 flex-1">
          <span className="text-[11px] sm:text-[12px] font-medium text-[#B8AFA7] uppercase tracking-widest w-16 sm:w-24 shrink-0">
            E-Mail
          </span>
          <span className="text-[14px] text-[#1A1714] truncate min-w-0">{email}</span>
        </div>
      </div>
    </div>
  )
}
