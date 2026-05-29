"use client"

interface UserActiveToggleProps {
  action: (formData: FormData) => Promise<void>
  userId: string
  isActive: boolean
  userName: string
}

export function UserActiveToggle({ action, userId, isActive, userName }: UserActiveToggleProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const msg = isActive
          ? `${userName} deaktivieren? Der Nutzer verliert damit den Zugang.`
          : `${userName} reaktivieren?`
        if (!confirm(msg)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="is_active" value={String(isActive)} />
      <button
        type="submit"
        className={`px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-colors ${
          isActive
            ? "border-[#E8E2D9] text-[#C4574A] hover:bg-[#FEF2F1] hover:border-[#C4574A]/20"
            : "border-[#E8E2D9] text-[#3A7A5C] hover:bg-[#EDF3F0] hover:border-[#3A7A5C]/20"
        }`}
      >
        {isActive ? "Deaktivieren" : "Reaktivieren"}
      </button>
    </form>
  )
}
