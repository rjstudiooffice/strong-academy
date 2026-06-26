import { getAppSettings } from "@/lib/supabase/content"
import { updateAppSettings } from "@/lib/supabase/admin-mutations"
import { BunnyVideoPicker } from "@/components/admin/BunnyVideoPicker"

export const dynamic = "force-dynamic"

export default async function EinstellungenPage() {
  const settings = await getAppSettings()

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">Einstellungen</h1>
        <p className="text-[12px] text-[#9E9188] mt-1">
          Globale Einstellungen der Plattform.
        </p>
      </div>

      <form action={updateAppSettings} className="bg-white border border-[#E8E2D9] rounded-2xl p-6 space-y-5">
        <div>
          <p className="text-[13px] font-semibold text-[#1A1714] mb-1">Willkommensvideo</p>
          <p className="text-[12px] text-[#9E9188] mb-4">
            Wird jedem neu registrierten Nutzer als allererstes gezeigt, bevor er die App nutzen kann.
          </p>
          <BunnyVideoPicker
            defaultVideoId={settings.welcome_video_id}
            defaultVideoUrl={settings.welcome_video_url}
            defaultDurationSeconds={settings.welcome_video_duration_seconds}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#5B2D8E] text-white rounded-xl text-[13px] font-medium hover:bg-[#4A2478] transition-colors"
          >
            Speichern
          </button>
        </div>
      </form>
    </div>
  )
}
