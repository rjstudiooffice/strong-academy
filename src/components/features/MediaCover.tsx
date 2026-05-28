import Image from "next/image"
import { cn } from "@/lib/utils"

type MediaCoverProps = {
  gradient: string
  imageSrc?: string
  index?: string
  className?: string
  children?: React.ReactNode
  objectPosition?: string
  darkTint?: boolean
  sizes?: string
  priority?: boolean
}

export function MediaCover({
  gradient,
  imageSrc,
  index,
  className,
  children,
  objectPosition = "center",
  darkTint = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 450px",
  priority = false,
}: MediaCoverProps) {
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", gradient, className)}>

      {/* Real image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt=""
          fill
          quality={90}
          className="object-cover"
          style={{ objectPosition }}
          sizes={sizes}
          priority={priority}
        />
      )}

      {/* Gradient-only: warm diffused light top-left */}
      {!imageSrc && (
        <div className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(ellipse_90%_70%_at_15%_15%,_rgba(255,250,240,0.22)_0%,_transparent_62%)]" />
      )}

      {/* Image mode: subtle overall tint for depth + contrast */}
      {imageSrc && (
        <div className="absolute inset-0 pointer-events-none bg-[#1A1714]/15" />
      )}

      {/* Leadership dark tint */}
      {darkTint && (
        <div className="absolute inset-0 pointer-events-none bg-[#1A1714]/20" />
      )}

      {/* Ambient shadow — bottom-right */}
      <div className="absolute inset-0 pointer-events-none
        bg-[radial-gradient(ellipse_55%_45%_at_88%_88%,_rgba(0,0,0,0.14)_0%,_transparent_65%)]" />

      {/* Bottom fade — stronger on real images to protect text + watermark */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none bg-gradient-to-t",
        imageSrc
          ? "from-black/[0.42] via-black/[0.14] to-transparent"
          : "from-black/[0.14] via-black/[0.04] to-transparent"
      )} />

      {/* Index watermark — higher opacity + shadow on photos */}
      {index && (
        <span
          className={cn(
            "absolute bottom-3 right-4 select-none pointer-events-none",
            "text-[3.5rem] font-bold leading-none tabular-nums",
            imageSrc
              ? "text-white/[0.22] drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              : "text-white/[0.10]"
          )}
        >
          {index}
        </span>
      )}

      {children}
    </div>
  )
}
