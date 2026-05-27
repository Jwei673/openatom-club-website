export interface Project {
  id: number
  name: string
  description: string
  coverImage: string
  repositoryUrl: string
  demoUrl: string
  leaderId: number
  leaderName?: string
  status: string // recruiting, developing, completed
  createdAt: string
  updatedAt: string
}

export interface ProjectQuery {
  page: number
  size: number
  status?: string
  keyword?: string
}

export interface ProjectMember {
  id: number
  projectId: number
  userId: number
  userName?: string
  role: string
  joinedAt: string
}
