// Bunny Stream API client — server-side only (never import in client components)

const API_KEY    = process.env.BUNNY_API_KEY!
const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID!

export type BunnyVideo = {
  id:               string
  title:            string
  duration_seconds: number
  embed_url:        string
}

export async function listVideos(prefix?: string | null): Promise<BunnyVideo[]> {
  if (!API_KEY || !LIBRARY_ID) return []

  const params = new URLSearchParams({
    page:         "1",
    itemsPerPage: "100",
    orderBy:      "title",
  })
  if (prefix) params.set("search", prefix)

  const res = await fetch(
    `https://video.bunnycdn.com/library/${LIBRARY_ID}/videos?${params}`,
    {
      headers: { AccessKey: API_KEY },
      next:    { revalidate: 60 },
    }
  )

  if (!res.ok) {
    console.error(`Bunny API error: ${res.status}`)
    return []
  }

  const data = await res.json()
  const raw: any[] = data.items ?? []

  // Bunny search is fuzzy — apply exact prefix filter client-side
  const filtered = prefix
    ? raw.filter((v) => typeof v.title === "string" && v.title.startsWith(prefix))
    : raw

  return filtered
    .filter((v) => v.status === 4) // 4 = encoded/ready
    .map((v) => ({
      id:               v.guid,
      title:            v.title,
      duration_seconds: v.length ?? 0,
      embed_url:        `https://iframe.mediadelivery.net/embed/${LIBRARY_ID}/${v.guid}`,
    }))
}
