"use client"

interface RoleToggleProps {
  action:   (formData: FormData) => Promise<void>
  userId:   string
  role:     "admin" | "partner"
  userName: string
}

export function RoleToggle({ action, userId, role, userName }: RoleToggleProps) {
  const nextRole: "admin" | "partner" = role === "admin" ? "partner" : "admin"

  return (
    <form
      action={action}
      onSubmit={(e) => {
        const msg = role === "admin"
          ? `${userName} die Admin-Rolle entziehen?`
          : `${userName} zum Admin machen?`
        if (!confirm(msg)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={userId} />
      <input type="hidden" name="role" value={nextRole} />
      <button
        type="submit"
        className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider border transition-colors cursor-pointer ${
          role === "admin"
            ? "bg-[#F0EBF8] text-[#5B2D8E] border-[#D8C8F0] hover:bg-[#E8DEFA]"
            : "bg-[#F5F4F2] text-[#9E9188] border-[#E8E2D9] hover:bg-[#F0EBF8] hover:text-[#5B2D8E] hover:border-[#D8C8F0]"
        }`}
      >
        {role === "admin" ? "Admin" : "Partner"}
      </button>
    </form>
  )
}
