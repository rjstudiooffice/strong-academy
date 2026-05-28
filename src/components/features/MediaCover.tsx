import Image from "next/image"
import { cn } from "@/lib/utils"

type MediaCoverProps = {
  gradient: string           // gradient fallback (always applied as bg — acts as placeholder + bleed color)
  imageSrc?: string          // real image path — if provided, renders on top of gradient
  index?: string             // watermark number
  className?: string
  children?: React.ReactNode
  objectPosition?: string    // focal point, default "center"
  darkTint?: boolean         // Leadership: additional dark overlay for depth
}

export function MediaCover({
  gradient,
  imageSrc,
  index,
  className,
  children,
  objectPosition = "center",
  darkTint = false,
}: MediaCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", gradient, className)}>

      {/* Real image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
          priority={false}
        />
      )}

      {/* Warm diffused light — gradient-only mode */}
      {!imageSrc && (
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_90%_70%_at_15%_15%,_rgba(255,250,240,0.22)_0%,_transparent_62%)]" />
      )}

      {/* Leadership dark tint — cinematic depth */}
      {darkTint && (
        <div className="absolute inset-0 pointer-events-none bg-[#1A1714]/28" />
      )}

      {/* Ambient shadow — bottom-right */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_55%_45%_at_88%_88%,_rgba(0,0,0,0.12)_0%,_transparent_65%)]" />

      {/* Depth fade — bottom edge (stronger when image present) */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none bg-gradient-to-t",
        imageSrc
          ? "from-black/[0.32] via-black/[0.10] to-transparent"
          : "from-black/[0.14] via-black/[0.04] to-transparent"
      )} />

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
