export interface BlogPost {
  id: string
  title: string
  url: string
  publishedAt: string
  category: string
  thumbnail?: { url: string; width: number; height: number }
  body: string
}
