import Link from "next/link"
import { ArrowLeft, ArrowRight, Play, Clock } from "lucide-react"
import { getLessonNavContext, formatDuration } from "@/lib/supabase/content"
import { getProfile } from "@/lib/supabase/profile"
import { notFound, redirect } from "next/navigation"
import { cn } from "@/lib/utils"
import { MediaCover } from "@/components/features/MediaCover"

export const dynamic = "force-dynamic"

export default async function LeadershipLessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await params

  const profile = await getProfile()
  if (!profile?.leadership_unlocked) redirect("/leadership")

  const ctx = await getLessonNavContext(slug, lessonSlug)
  if (!ctx || ctx.category.type !== "leadership") notFound()

  const { category, lesson, index, prev, next, allLessons } = ctx

  return (
    <div className="space-y-8 pt-2">

      <Link
        href={`/leadership/${slug}`}
        className="inline-flex items-center gap-2 text-[13px] text-[#6B6050] hover:text-[#9E9080] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        {category.name}
      </Link>

      {/* Video */}
      <section>
        <div className="rounded-2xl shadow-[0_8px_48px_rgba(0,0,0,0.5),_0_2px_8px_rgba(0,0,0,0.3)]">
          {lesson.video_url ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden">
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <MediaCover gradient={lesson.cover_gradient ?? "from-[#4A4440] to-[#2C2820]"} className="aspect-video w-full rounded-2xl">
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4">
                <span className="text-[11px] font-semibold text-white/65 uppercase tracking-widest">
                  {String(index + 1).padStart(2, "0")} / {String(allLessons.length).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1.5 bg-black/25 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-white/70" strokeWidth={1.75} />
                  <span className="text-[11px] font-medium text-white/70">{formatDuration(lesson.duration_seconds)}</span>
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md ring-1 ring-white/20 flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                  <Play className="w-6 h-6 text-white ml-1" fill="currentColor" strokeWidth={0} />
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/50 via-black/15 to-transparent">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-widest mb-1.5">
                  {category.tagline}
                </p>
                <p className="text-[15px] font-semibold text-white/90 leading-snug">{lesson.title}</p>
              </div>
            </MediaCover>
          )}
        </div>
      </section>

      {/* Content + Lesson list */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 pt-2">

        <section className="space-y-8">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-[#9B72CC] uppercase tracking-widest">
              {category.tagline}
            </p>
            <h1 className="text-[1.85rem] font-semibold text-[#EDE8DF] tracking-tight leading-snug">
              {lesson.title}
            </h1>
            <p className="text-[15px] text-[#9E9080] leading-relaxed max-w-[52ch]">
              {lesson.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[#38322A]">
            {prev ? (
              <Link href={`/leadership/${slug}/${prev.slug}`} className="flex items-center gap-3 group max-w-[45%]">
                <div className="w-8 h-8 rounded-xl bg-[#242019] border border-[#38322A] flex items-center justify-center shrink-0 group-hover:bg-[#2C2820] group-hover:border-[#4A4438] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#9E9080]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] text-[#6B6050] uppercase tracking-widest">Vorherige</p>
                  <p className="text-[13px] font-medium text-[#EDE8DF] leading-snug line-clamp-1">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link href={`/leadership/${slug}/${next.slug}`} className="flex items-center gap-3 group text-right max-w-[45%]">
                <div>
                  <p className="text-[10px] text-[#6B6050] uppercase tracking-widest">Nächste</p>
                  <p className="text-[13px] font-medium text-[#EDE8DF] leading-snug line-clamp-1">{next.title}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#242019] border border-[#38322A] flex items-center justify-center shrink-0 group-hover:bg-[#2C2820] group-hover:border-[#4A4438] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-[#9E9080]" strokeWidth={2} />
                </div>
              </Link>
            ) : <div />}
          </div>
        </section>

        {/* Right: Lesson list */}
        <aside className="space-y-4">
          <div className="bg-[#242019] rounded-2xl border border-[#38322A] px-4 py-4">
            <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest">
              {category.name}
            </p>
            <p className="mt-1 text-[12px] text-[#4A4438]">{allLessons.length} Lektionen</p>
          </div>

          <div className="space-y-0.5">
            {allLessons.map((l, i) => {
              const isCurrent = l.slug === lessonSlug
              return (
                <Link
                  key={l.slug}
                  href={`/leadership/${slug}/${l.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    isCurrent ? "bg-[#2E2920] border border-[#4A4438]" : "hover:bg-[#242019]"
                  )}
                >
                  <span className="text-[11px] text-[#4A4438] tabular-nums w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[13px] leading-snug",
                      isCurrent ? "font-semibold text-[#EDE8DF]" : "font-medium text-[#9E9080]"
                    )}>
                      {l.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6B6050]">{formatDuration(l.duration_seconds)}</p>
                  </div>
                  {isCurrent
                    ? <span className="w-1.5 h-1.5 rounded-full bg-[#9B72CC] shrink-0" />
                    : <span className="w-1.5 h-1.5 rounded-full border border-[#4A4438] shrink-0" />
                  }
                </Link>
              )
            })}
          </div>
        </aside>

      </div>

    </div>
  )
}
