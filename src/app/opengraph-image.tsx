import { ImageResponse } from "next/og"
import { readFile } from "fs/promises"
import { join } from "path"

export const runtime     = "nodejs"
export const size        = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const logoData   = await readFile(join(process.cwd(), "public/logo.png"))
  const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          width:           "100%",
          height:          "100%",
          backgroundColor: "#FAF9F6",
          padding:         "60px 80px",
          gap:             "56px",
        }}
      >
        {/* Logo */}
        <img
          src={logoBase64}
          width={180}
          height={180}
          style={{ borderRadius: "28px", flexShrink: 0 }}
        />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize:      68,
              fontWeight:    700,
              color:         "#1A1714",
              letterSpacing: "-2px",
              lineHeight:    1,
            }}
          >
            Strong Academy
          </div>
          <div
            style={{
              display:       "flex",
              flexDirection: "column",
              fontSize:      30,
              fontWeight:    400,
              color:         "#5B2D8E",
              letterSpacing: "-0.3px",
              lineHeight:    1.4,
            }}
          >
            <span>Dein Wissenszentrum für Gesundheit,</span>
            <span>Leadership & Wachstum.</span>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
