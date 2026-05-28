import Link from "next/link"
import { ArrowLeft, ArrowRight, Play, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"
import { getLessonContext, getAllLessonParams, lessonCount, completedCount, type Lesson, type LessonAttachment } from "@/lib/data/academy"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { MediaCover } from "@/components/features/MediaCover"

// ─── File type badge ─────────────────────────────────────────────────────────

const FILE_COLORS: Record<string, string> = {
  PDF:  "bg-[#F0EBF8] text-[#5B2D8E]",
  PPTX: "bg-[#EDF3F0] text-[#3A7A5C]",
  DOCX: "bg-[#F5EFE8] text-[#8A6040]",
}

function AttachmentRow({ file }: { file: LessonAttachment }) {
  return (
    <div className="flex items-center gap-4 bg-[#F5F0E8] border border-[#E8E2D9] rounded-xl px-4 py-3">
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${FILE_COLORS[file.fileType] ?? FILE_COLORS.PDF}`}>
        {file.fileType}
      </span>
      <span className="text-[14px] font-medium text-[#1A1714] flex-1 min-w-0 truncate">
        {file.title}
      </span>
      {file.fileSize && (
        <span className="text-[11px] text-[#B8AFA7] shrink-0 hidden sm:block">{file.fileSize}</span>
      )}
      <button className="inline-flex items-center gap-1 text-[12px] font-medium text-[#5B2D8E] hover:text-[#4A2478] transition-colors shrink-0">
        Ansehen <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
      </button>
    </div>
  )
}

export function generateStaticParams() {
  return getAllLessonParams()
}

// ─── Status indicator dot (lesson list) ─────────────────────────────────────

function LessonDot({ lesson, isCurrent }: { lesson: Lesson; isCurrent: boolean }) {
  if (isCurrent)               return <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E] shrink-0" />
  if (lesson.status === "done") return <span className="w-1.5 h-1.5 rounded-full bg-[#5B2D8E]/30 shrink-0" />
  return                              <span className="w-1.5 h-1.5 rounded-full border border-[#D8D1C7] shrink-0" />
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonSlug: string }>
}) {
  const { slug, lessonSlug } = await params
  const ctx = getLessonContext(slug, lessonSlug)
  if (!ctx) notFound()

  const { category, lesson, index, prev, next } = ctx
  const catProgress = Math.round((completedCount(category) / category.lessons.length) * 100)

  return (
    <div className="space-y-8 pt-2">

      {/* Back */}
      <Link
        href={`/academy/${slug}`}
        className="inline-flex items-center gap-2 text-[13px] text-[#9E9188] hover:text-[#1A1714] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        {category.name}
      </Link>

      {/* ── VIDEO ──────────────────────────────────────────────────────────── */}
      <section>
        {/*
          Outer wrapper carries the shadow — the overflow-hidden on MediaCover
          would clip it, so shadow lives one level up.
        */}
        <div className="rounded-2xl shadow-[0_4px_40px_rgba(26,23,20,0.10),_0_1px_6px_rgba(26,23,20,0.06)]">
          <MediaCover
            gradient={lesson.cover}
            className="aspect-video w-full rounded-2xl"
          >
            {/* ── Meta: top row ── */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-4">
              {/* Position counter */}
              <span className="text-[11px] font-semibold text-white/65 uppercase tracking-widest">
                {String(index + 1).padStart(2, "0")} / {String(lessonCount(category)).padStart(2, "0")}
              </span>
              {/* Duration pill */}
              <span className="flex items-center gap-1.5 bg-black/18 backdrop-blur-sm px-3 py-1 rounded-full">
                <Clock className="w-3 h-3 text-white/70" strokeWidth={1.75} />
                <span className="text-[11px] font-medium text-white/70">{lesson.duration}</span>
              </span>
            </div>

            {/* ── Centre: play button ── */}
            <button className="absolute inset-0 flex items-center justify-center group/play">
              <span className="
                w-16 h-16 rounded-full
                bg-white/75 backdrop-blur-md
                ring-1 ring-white/25
                flex items-center justify-center
                shadow-[0_4px_20px_rgba(0,0,0,0.18)]
                group-hover/play:bg-white/90 group-hover/play:scale-105
                transition-all duration-200 ease-out
              ">
                <Play className="w-6 h-6 text-[#5B2D8E] ml-1" fill="currentColor" strokeWidth={0} />
              </span>
            </button>

            {/* ── Bottom: title overlay ── */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 pt-10
              bg-gradient-to-t from-black/32 via-black/10 to-transparent">
              <p className="text-[10px] font-semibold text-white/55 uppercase tracking-widest mb-1.5">
                {category.tagline}
              </p>
              <p className="text-[15px] font-semibold text-white/90 leading-snug">
                {lesson.title}
              </p>
            </div>
          </MediaCover>
        </div>
      </section>

      {/* ── CONTENT + LESSON LIST ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 pt-2">

        {/* Main content */}
        <section className="space-y-8">

          {/* Title + description */}
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

          {/* Progress status — read-only, set automatically by video player.
              Integration point: VideoPlayer fires onProgress(pct) and onComplete()
              → Supabase upsert into lesson_progress table.
              No manual override: progress reflects actual watch time only. */}
          <div className="pt-1">
            {lesson.status === "done" && (
              <div className="inline-flex items-center gap-2 text-[13px] text-[#5B2D8E]/55 bg-[#F0EBF8] px-4 py-2 rounded-xl">
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                Lektion abgeschlossen
              </div>
            )}
            {lesson.status === "progress" && (
              <div className="flex items-center gap-4">
                <div className="h-[2px] w-40 rounded-full bg-[#E3DDD5] overflow-hidden">
                  <div className="h-full rounded-full bg-[#5B2D8E]/40" style={{ width: `${lesson.pct}%` }} />
                </div>
                <span className="text-[11px] text-[#B8AFA7] tabular-nums">{lesson.pct}% gesehen</span>
              </div>
            )}
          </div>

          {/* Attachments — only rendered when present */}
          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="pt-2 space-y-3">
              <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
                Unterlagen
              </p>
              {lesson.attachments.map((file) => (
                <AttachmentRow key={file.title} file={file} />
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D9]">
            {prev ? (
              <Link
                href={`/academy/${slug}/${prev.slug}`}
                className="flex items-center gap-3 group max-w-[45%]"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] border border-[#E8E2D9] flex items-center justify-center shrink-0 group-hover:bg-[#EDE8DF] transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5 text-[#6B5E52]" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] text-[#B8AFA7] uppercase tracking-widest">Vorherige</p>
                  <p className="text-[13px] font-medium text-[#1A1714] leading-snug line-clamp-1">
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : <div />}

            {next ? (
              <Link
                href={`/academy/${slug}/${next.slug}`}
                className="flex items-center gap-3 group text-right max-w-[45%]"
              >
                <div>
                  <p className="text-[10px] text-[#B8AFA7] uppercase tracking-widest">Nächste</p>
                  <p className="text-[13px] font-medium text-[#1A1714] leading-snug line-clamp-1">
                    {next.title}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#F5F0E8] border border-[#E8E2D9] flex items-center justify-center shrink-0 group-hover:bg-[#EDE8DF] transition-colors">
                  <ArrowRight className="w-3.5 h-3.5 text-[#6B5E52]" strokeWidth={2} />
                </div>
              </Link>
            ) : <div />}
          </div>

        </section>

        {/* ── Right: Lesson list ── */}
        <aside className="space-y-4">
          {/* Category progress summary */}
          <div className="bg-[#F5F0E8] rounded-2xl border border-[#E8E2D9] px-4 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[10px] font-semibold text-[#B8AFA7] uppercase tracking-widest">
                {category.name}
              </p>
              <span className="text-[11px] text-[#B8AFA7] tabular-nums">
                {completedCount(category)}/{lessonCount(category)}
              </span>
            </div>
            <div className="h-[2px] w-full rounded-full bg-[#E3DDD5] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B2D8E]/35 transition-all duration-700"
                style={{ width: `${catProgress}%` }}
              />
            </div>
          </div>

          {/* Lesson rows */}
          <div className="space-y-0.5">
            {category.lessons.map((l, i) => {
              const isCurrent = l.slug === lessonSlug
              return (
                <Link
                  key={l.slug}
                  href={`/academy/${slug}/${l.slug}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
                    isCurrent
                      ? "bg-white border border-[#E8E2D9] shadow-sm"
                      : "hover:bg-[#F5F0E8]"
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
                    <p className="mt-0.5 text-[11px] text-[#B8AFA7]">{l.duration}</p>
                  </div>
                  <LessonDot lesson={l} isCurrent={isCurrent} />
                </Link>
              )
            })}
          </div>
        </aside>
      </div>

    </div>
  )
}
