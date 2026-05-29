import Link from "next/link"
import { ArrowLeft, Play, CheckCircle2, Circle, Clock } from "lucide-react"
import { getCategoryWithLessons, formatDuration, type ContentLesson } from "@/lib/supabase/content"
import { getProfile } from "@/lib/supabase/profile"
import { getLessonsWithProgress, getCategoryProgress, type LessonProgress } from "@/lib/supabase/progress"
import { MediaCover } from "@/components/features/MediaCover"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

function LessonStatus({ dbLesson }: { dbLesson: LessonProgress | undefined }) {
  if (dbLesson?.completed) {
    return (
      <span className="flex items-center gap-1.5 text-[12px] text-[#5B2D8E]/55">
        <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
        Abgeschlossen
      </span>
    )
  }
  if ((dbLesson?.progress_percent ?? 0) > 0) {
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-24 h-[2px] rounded-full bg-[#E3DDD5] overflow-hidden">
          <div className="h-full rounded-full bg-[#5B2D8E]/40" style={{ width: `${dbLesson!.progress_percent}%` }} />
        </div>
        <span className="text-[11px] text-[#B8AFA7] tabular-nums">{dbLesson!.progress_percent}%</span>
      </div>
    )
  }
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-[#C4B9B0]">
      <Circle className="w-3.5 h-3.5" strokeWidth={1.5} />
      Noch nicht begonnen
    </span>
  )
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = await getCategoryWithLessons(slug)
  if (!category) notFound()

  const foundation = category.type === "foundation"

  const profile   = await getProfile()
  const dbLessons = profile ? await getLessonsWithProgress(profile.id, slug) : []
  const progress  = profile ? await getCategoryProgress(profile.id, slug) : { completed: 0, total: 0, pct: 0 }

  return (
    <div className="space-y-14 pt-2">

      <Link
        href="/academy"
        className="inline-flex items-center gap-2 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Zurück zur Academy
      </Link>

      {/* Hero */}
      <section className="rounded-2xl overflow-hidden border border-[#E8E2D9]">
        <MediaCover
          gradient={category.cover_gradient ?? "from-[#B0A898] to-[#8C8070]"}
          imageSrc={category.hero_image_url ?? undefined}
          index={foundation ? (category.index_label ?? undefined) : undefined}
          objectPosition={slug === "produktwissen" ? "center center" : "center 35%"}
          sizes="(max-width: 768px) 100vw, calc(100vw - 280px)"
          priority
          className="h-56 sm:h-80"
        />

        <div className="bg-[#F5F0E8] px-8 py-7">
          <p className="text-[10px] font-semibold text-[#5B2D8E] uppercase tracking-widest mb-3">
            {foundation ? (category.tagline ?? "") : "Wissensbibliothek"}
          </p>
          <h1 className="text-[1.65rem] sm:text-[2rem] font-semibold text-[#1A1714] tracking-tight leading-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-[15px] text-[#8C7E6F] leading-relaxed max-w-xl">
            {category.description}
          </p>

          {foundation && progress.total > 0 && (
            <div className="mt-6 flex items-center gap-5">
              <div className="flex-1 max-w-xs">
                <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                    style={{ width: `${progress.pct}%` }}
                  />
                </div>
              </div>
              <p className="text-[13px] text-[#9E9188] shrink-0">
                {progress.completed} von {progress.total} {progress.total === 1 ? "Lektion" : "Lektionen"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lesson list */}
      <section>
        <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest mb-6">
          Lektionen
        </p>

        {category.lessons.length === 0 && (
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] p-10 text-center">
            <p className="text-[14px] text-[#B8AFA7]">Inhalte folgen in Kürze.</p>
          </div>
        )}

        <div className="space-y-3">
          {category.lessons.map((lesson, i) => {
            const dbLesson = dbLessons.find((dl) => dl.slug === lesson.slug)
            return (
              <Link
                key={lesson.slug}
                href={`/academy/${slug}/${lesson.slug}`}
                className="group flex flex-col sm:flex-row bg-[#F5F0E8] hover:bg-[#EDE8DF] border border-[#E8E2D9] rounded-2xl overflow-hidden transition-all hover:shadow-sm"
              >
                <MediaCover
                  gradient={lesson.cover_gradient ?? "from-[#B0A898] to-[#8C8070]"}
                  imageSrc={lesson.thumbnail_url ?? undefined}
                  index={foundation ? String(i + 1).padStart(2, "0") : undefined}
                  className="w-full sm:w-52 h-36 sm:h-auto shrink-0"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/78 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Play className="w-3.5 h-3.5 text-[#5B2D8E] ml-0.5" fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </MediaCover>

                <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1A1714] leading-snug">{lesson.title}</p>
                    <p className="mt-2 text-[13px] text-[#9E9188] leading-relaxed">{lesson.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-4 flex-wrap">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#B8AFA7]">
                      <Clock className="w-3 h-3" strokeWidth={1.75} />
                      {formatDuration(lesson.duration_seconds)}
                    </span>
                    {foundation && <LessonStatus dbLesson={dbLesson} />}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

    </div>
  )
}
