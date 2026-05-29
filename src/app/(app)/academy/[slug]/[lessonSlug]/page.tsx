import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock, ArrowUpRight } from "lucide-react"
import { getLessonNavContext, formatDuration, type ContentLessonFile } from "@/lib/supabase/content"
import { getProfile } from "@/lib/supabase/profile"
import { getLessonsWithProgress, type LessonProgress } from "@/lib/supabase/progress"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { MediaCover } from "@/components/features/MediaCover"
import { LessonProgressControls } from "./_controls"

export const dynamic = "force-dynamic"

const FILE_COLORS: Record<string, string> = {
  PDF:  "bg-[#F0EBF8] text-[#5B2D8E]",
  PPTX: "bg-[#EDF3F0] text-[#3A7A5C]",
  DOCX: "bg-[#F5EFE8] text-[#8A6040]",
}

function AttachmentRow({ file }: { file: ContentLessonFile }) {
  const ext = file.file_url.split(".").pop()?.toUpperCase() ?? "PDF"
  return (
    <a
      href={file.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3 hover:bg-[#EDE8DF] transition-colors"
    >
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${FILE_COLORS[ext] ?? FILE_COLORS.PDF}`}>
        {ext}
      </span>
      <span className="text-[14px] font-medium text-[#1A1714] flex-1 min-w-0 truncate">{file.title}</span>
      <ArrowUpRight className="w-3.5 h-3.5 text-[#B8AFA7] shrink-0" strokeWidth={2} />
    </a>
  )
}

function LessonDot({
  dbLesson,
  isCurrent,
}: {
  dbLesson: LessonProgress | undefined
  isCurrent: boolean
}) {
  if (isCurrent)                   return <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E] shrink-0" />
  if (dbLesson?.completed)         return <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]/30 shrink-0" />
  if ((dbLesson?.progress_percent ?? 0) > 0)
    return <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]/15 border border-[#5B2D8E]/30 shrink-0" />
  return <span className="w-1.5 h-1.5 rounded-full border border-[#D8D1C7] shrink-0" />
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await params
  const ctx = await getLessonNavContext(slug, lessonSlug)
  if (!ctx) notFound()

  const { category, lesson, index, prev, next, allLessons } = ctx

  const profile   = await getProfile()
  const dbLessons = profile ? await getLessonsWithProgress(profile.id, slug) : []

  const dbCurrent       = dbLessons.find((l) => l.slug === lessonSlug)
  const lessonId        = dbCurrent?.id ?? null
  const progressPercent = dbCurrent?.progress_percent ?? 0
  const completed       = dbCurrent?.completed ?? false

  const catCompleted = dbLessons.filter((l) => l.completed).length
  const catTotal     = dbLessons.length || allLessons.length
  const catPct       = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0

  return (
    <div className="space-y-8 pt-2">

      <Link
        href={`/academy/${slug}`}
        className="inline-flex items-center gap-2 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        {category.name}
      </Link>

      {/* Video */}
      <section>
        <div className="rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)]">
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
            <MediaCover
              gradient={lesson.cover_gradient ?? "from-[#B0A898] to-[#8C8070]"}
              imageSrc={lesson.thumbnail_url ?? undefined}
              className="aspect-video w-full rounded-2xl"
            >
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4">
                <span className="text-[11px] font-semibold text-white/65 uppercase tracking-widest">
                  {String(index + 1).padStart(2, "0")} / {String(catTotal).padStart(2, "0")}
                </span>
                <span className="flex items-center gap-1.5 bg-black/18 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Clock className="w-3 h-3 text-white/70" strokeWidth={1.75} />
                  <span className="text-[11px] font-medium text-white/70">{formatDuration(lesson.duration_seconds)}</span>
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-white/75 backdrop-blur-md ring-1 ring-white/25 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.18)]">
                  <span className="text-[#5B2D8E] text-xs font-medium">Video folgt</span>
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10 bg-gradient-to-t from-black/32 via-black/10 to-transparent">
                <p className="text-[10px] font-semibold text-white/55 uppercase tracking-widest mb-1.5">
                  {category.tagline}
                </p>
                <p className="text-[15px] font-semibold text-white/90 leading-snug">{lesson.title}</p>
              </div>
            </MediaCover>
          )}
        </div>
      </section>

      {/* Content + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 pt-2">

        <section className="space-y-8">

          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-[#5B2D8E] uppercase tracking-widest">
              {category.tagline}
            </p>
            <h1 className="text-[1.85rem] font-semibold text-[#1A1714] tracking-tight leading-snug">
              {lesson.title}
            </h1>
            <p className="text-[15px] text-[#8C7E6F] leading-relaxed max-w-[52ch]">
              {lesson.description}
            </p>
          </div>

          <div className="pt-1">
            {lessonId ? (
              <LessonProgressControls
                lessonId={lessonId}
                initialProgress={progressPercent}
                initialCompleted={completed}
              />
            ) : (
              <p className="text-[13px] text-[#C4B9B0]">
                Lektion noch nicht in der Datenbank — Migration ausführen.
              </p>
            )}
          </div>

          {lesson.lesson_files.length > 0 && (
            <div className="pt-2 space-y-3">
              <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
                Unterlagen
              </p>
              {lesson.lesson_files.map((file) => (
                <AttachmentRow key={file.id} file={file} />
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D9]">
            {prev ? (
              <Link href={`/academy/${slug}/${prev.slug}`} className="flex items-center gap-3 group max-w-[45%]">
                <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] border border-[#E8E2D9] flex items-center justify-center shrink-0 group-hover:bg-[#EDE8DF] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#6B5E52]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] text-[#B8AFA7] uppercase tracking-widest">Vorherige</p>
                  <p className="text-[13px] font-medium text-[#1A1714] leading-snug line-clamp-1">{prev.title}</p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link href={`/academy/${slug}/${next.slug}`} className="flex items-center gap-3 group text-right max-w-[45%]">
                <div>
                  <p className="text-[10px] text-[#B8AFA7] uppercase tracking-widest">Nächste</p>
                  <p className="text-[13px] font-medium text-[#1A1714] leading-snug line-clamp-1">{next.title}</p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] border border-[#E8E2D9] flex items-center justify-center shrink-0 group-hover:bg-[#EDE8DF] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B5E52]" strokeWidth={2} />
                </div>
              </Link>
            ) : <div />}
          </div>

        </section>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-4 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
                {category.name}
              </p>
              <span className="text-[11px] text-[#B8AFA7] tabular-nums">
                {catCompleted}/{catTotal}
              </span>
            </div>
            <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                style={{ width: `${catPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-0.5">
            {allLessons.map((l, i) => {
              const isCurrent = l.slug === lessonSlug
              const dbLesson  = dbLessons.find((dl) => dl.slug === l.slug)
              return (
                <Link
                  key={l.slug}
                  href={`/academy/${slug}/${l.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    isCurrent ? "bg-white border border-[#E8E2D9] shadow-sm" : "hover:bg-[#F5F0E8]"
                  )}
                >
                  <span className="text-[11px] text-[#C4B9B0] tabular-nums w-5 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-[13px] leading-snug",
                      isCurrent ? "font-semibold text-[#1A1714]" : "font-medium text-[#6B5E52]"
                    )}>
                      {l.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#B8AFA7]">{formatDuration(l.duration_seconds)}</p>
                  </div>
                  <LessonDot dbLesson={dbLesson} isCurrent={isCurrent} />
                </Link>
              )
            })}
          </div>
        </aside>

      </div>
    </div>
  )
}
