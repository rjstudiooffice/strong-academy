import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Strong Academy",
  description: "Dein persönliches Wissenszentrum für Gesundheit, Leadership und Wachstum.",
  openGraph: {
    title:       "Strong Academy",
    description: "Dein persönliches Wissenszentrum für Gesundheit, Leadership und Wachstum.",
    siteName:    "Strong Academy",
    locale:      "de_DE",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Strong Academy",
    description: "Dein persönliches Wissenszentrum für Gesundheit, Leadership und Wachstum.",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  // Prevents Safari auto-zoom on input focus (inputs use font-size ≥ 16px)
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} h-full`}>
      <body className="h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
