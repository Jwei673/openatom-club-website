export interface User {
  id: number
  username: string
  realName: string
  studentId: string
  email: string
  phone: string
  avatar: string
  departmentId: number
  departmentName?: string
  position: string
  points: number
  role: string
  status: string
  lastLoginTime: string
  createdAt: string
  updatedAt: string
}

export interface UserQuery {
  page: number
  size: number
  username?: string
  realName?: string
  departmentId?: number
  role?: string
  status?: string
}

export interface PageResult<T> {
  records: T[]
  total: number
  page: number
  size: number
}
