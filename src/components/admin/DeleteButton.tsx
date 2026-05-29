"use client"

import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
  action: (formData: FormData) => Promise<void>
  id: string
  confirmText: string
  label?: string
  extraFields?: Record<string, string>
  variant?: "text" | "icon"
}

export function DeleteButton({
  action,
  id,
  confirmText,
  label = "Löschen",
  extraFields,
  variant = "text",
}: DeleteButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      {extraFields && Object.entries(extraFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}
      {variant === "icon" ? (
        <button
          type="submit"
          className="p-2 rounded-lg text-[#C4574A] hover:bg-[#FEF2F1] transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
        </button>
      ) : (
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg border border-[#E8E2D9] text-[12px] text-[#C4574A] hover:bg-[#FEF2F1] hover:border-[#C4574A]/20 transition-colors"
        >
          {label}
        </button>
      )}
    </form>
  )
}
