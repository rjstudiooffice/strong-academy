import Image from "next/image"
import { redirect } from "next/navigation"
import { getAppSettings } from "@/lib/supabase/content"
import { markWelcomeVideoSeen } from "@/lib/supabase/actions"
import { WelcomeVideoPlayer } from "@/components/features/WelcomeVideoPlayer"

export const dynamic = "force-dynamic"

export default async function WillkommenPage() {
  const settings = await getAppSettings()

  // No video configured yet — never block access to the app because of missing admin setup.
  if (!settings.welcome_video_url) {
    await markWelcomeVideoSeen()
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl space-y-8">
        <div className="text-center space-y-3">
          <Image src="/logo.png" alt="" width={56} height={56} className="mx-auto rounded-2xl" />
          <h1 className="text-[1.65rem] font-semibold text-[#1A1714] tracking-tight">
            Willkommen bei der Strong Academy
          </h1>
          <p className="text-[13px] text-[#9E9188]">
            Bevor es losgeht, hat Fabian ein paar Worte für dich.
          </p>
        </div>

        <WelcomeVideoPlayer
          videoUrl={settings.welcome_video_url}
          durationSeconds={settings.welcome_video_duration_seconds}
        />
      </div>
    </div>
  )
}
