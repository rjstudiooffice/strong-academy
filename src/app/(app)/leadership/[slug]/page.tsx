import Link from "next/link"
import { ArrowLeft, Play, Clock } from "lucide-react"
import { getLeadershipCategories, getLeadershipCategoryBySlug, isLeadershipUnlocked } from "@/lib/data/leadership"
import { MediaCover } from "@/components/features/MediaCover"
import { redirect } from "next/navigation"

export function generateStaticParams() {
  return getLeadershipCategories().map((cat) => ({ slug: cat.slug }))
}

export default async function LeadershipCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  if (!isLeadershipUnlocked()) redirect("/leadership")

  const category = getLeadershipCategoryBySlug(slug)
  if (!category) return null

  return (
    <div className="space-y-14 pt-2">

      <Link
        href="/leadership"
        className="inline-flex items-center gap-2 text-[13px] text-[#6B6050] hover:text-[#9E9080] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
        Zurück zu Leadership
      </Link>

      {/* Hero */}
      <section className="rounded-2xl overflow-hidden border border-[#38322A]">
        <MediaCover gradient={category.cover} index={category.index} className="h-52" />
        <div className="bg-[#242019] px-8 py-7">
          <p className="text-[10px] font-semibold text-[#9B72CC] uppercase tracking-widest mb-3">
            {category.tagline}
          </p>
          <h1 className="text-[1.65rem] sm:text-[2rem] font-semibold text-[#EDE8DF] tracking-tight leading-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-[15px] text-[#9E9080] leading-relaxed max-w-xl">
            {category.description}
          </p>
        </div>
      </section>

      {/* Lessons */}
      <section>
        <p className="text-[10px] font-semibold text-[#6B6050] uppercase tracking-widest mb-6">
          Lektionen
        </p>

        {category.lessons.length === 0 ? (
          <div className="bg-[#242019] rounded-2xl border border-[#38322A] p-10 text-center">
            <p className="text-[14px] text-[#6B6050]">Inhalte folgen in Kürze.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {category.lessons.map((lesson, i) => (
              <Link
                key={lesson.slug}
                href={`/leadership/${slug}/${lesson.slug}`}
                className="group flex flex-col sm:flex-row bg-[#242019] hover:bg-[#2C2820] border border-[#38322A] hover:border-[#4A4438] rounded-2xl overflow-hidden transition-all hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
              >
                <MediaCover
                  gradient={lesson.cover}
                  index={String(i + 1).padStart(2, "0")}
                  className="w-full sm:w-52 h-36 sm:h-auto shrink-0"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-white/25 transition-all">
                      <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </MediaCover>
                <div className="flex-1 px-6 py-5 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="text-[15px] font-semibold text-[#EDE8DF] leading-snug">{lesson.title}</p>
                    <p className="mt-2 text-[13px] text-[#9E9080] leading-relaxed">{lesson.description}</p>
                  </div>
                  <div className="mt-4">
                    <span className="flex items-center gap-1.5 text-[12px] text-[#6B6050]">
                      <Clock className="w-3 h-3" strokeWidth={1.75} />
                      {lesson.duration}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}
