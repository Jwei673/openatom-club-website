export interface Activity {
  id: number
  title: string
  description: string
  content: string
  coverImage: string
  startTime: string
  endTime: string
  location: string
  maxParticipants: number
  currentParticipants: number
  pointsReward: number
  organizerId: number
  organizerName?: string
  status: string // upcoming, ongoing, completed, cancelled
  createdAt: string
  updatedAt: string
}

export interface ActivityQuery {
  page: number
  size: number
  status?: string
  keyword?: string
}

export interface ActivityRegistration {
  id: number
  activityId: number
  userId: number
  status: string // registered, attended, cancelled
  registeredAt: string
}
