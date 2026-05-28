import { cn } from "@/lib/utils"

type MediaCoverProps = {
  gradient: string           // e.g. "from-[#9EB88C] to-[#7A9C68]"
  index?: string             // watermark number — "01", "03", etc.
  className?: string         // caller controls size (h-44, aspect-video, etc.)
  children?: React.ReactNode // play button, overlaid UI
}

/**
 * Shared cover surface for all media in the platform.
 * Handles the overlay system consistently — warm radial light,
 * ambient depth shadow, bottom fade, optional watermark number.
 */
export function MediaCover({ gradient, index, className, children }: MediaCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", gradient, className)}>
      {/* Warm diffused light — top-left origin */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_90%_70%_at_15%_15%,_rgba(255,250,240,0.22)_0%,_transparent_62%)]" />

      {/* Ambient shadow — bottom-right origin */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_55%_45%_at_88%_88%,_rgba(0,0,0,0.09)_0%,_transparent_65%)]" />

      {/* Depth fade — bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none
        bg-gradient-to-t from-black/[0.14] via-black/[0.04] to-transparent" />

      {/* Index watermark */}
      {index && (
        <span className="absolute bottom-3 right-4 select-none pointer-events-none
          text-[3.5rem] font-bold leading-none tabular-nums text-white/[0.08]">
          {index}
        </span>
      )}

      {children}
    </div>
  )
}
