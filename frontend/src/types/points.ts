export interface PointsRecord {
  id: number
  userId: number
  userName?: string
  points: number
  type: string // activity, project, contribution, reward, penalty
  description: string
  relatedId: number
  createdAt: string
}

export interface PointsQuery {
  page?: number
  size?: number
  userId?: number
  type?: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  size: number
}
