export interface Content {
  id: number
  title: string
  content: string
  summary: string
  type: string // news, notice, introduction
  coverImage: string
  authorId: number
  authorName?: string
  viewCount: number
  status: string // draft, published, archived
  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface ContentQuery {
  page: number
  size: number
  type?: string
  status?: string
  keyword?: string
}
