export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  confirmPassword: string
  realName: string
  studentId: string
  email: string
  phone: string
  departmentId: number
}

export interface LoginResult {
  token: string
  user: UserInfo
}

export interface UserInfo {
  id: number
  username: string
  realName: string
  studentId: string
  email: string
  phone: string
  avatar: string
  departmentId: number
  departmentName: string
  position: string
  points: number
  role: string
  status: string
  lastLoginTime: string
  createdAt: string
}
