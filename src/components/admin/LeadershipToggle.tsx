"use client"

interface LeadershipToggleProps {
  action: (formData: FormData) => Promise<void>
  userId: string
  unlocked: boolean
  userName: string
}

export function LeadershipToggle({ action, userId, unlocked, userName }: LeadershipToggleProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        const msg = unlocked
          ? `Leadership für ${userName} sperren?`
          : `Leadership für ${userName} freischalten?`
        if (!confirm(msg)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="leadership_unlocked" value={String(unlocked)} />
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold tracking-wide border transition-colors ${
          unlocked
            ? "bg-[#EDF3F0] text-[#3A7A5C] border-[#C8E0CE] hover:bg-[#D8EDD8] hover:border-[#3A7A5C]/30"
            : "bg-[#F5F4F2] text-[#9E9188] border-[#E8E2D9] hover:bg-[#F0EBF8] hover:text-[#5B2D8E] hover:border-[#5B2D8E]/20"
        }`}
      >
        {unlocked ? (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#3A7A5C]" />
            Freigeschaltet
          </>
        ) : (
          <>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C4B9B0]" />
            Gesperrt
          </>
        )}
      </button>
    </form>
  )
}
