export interface Approval {
  id: number
  type: string // join_club, activity, project, points
  applicantId: number
  applicantName?: string
  title: string
  description: string
  status: string // pending, approved, rejected
  reviewerId: number
  reviewerName?: string
  reviewComment: string
  reviewedAt: string
  createdAt: string
  updatedAt: string
}

export interface ApprovalQuery {
  page: number
  size: number
  type?: string
  status?: string
  applicantId?: number
}
