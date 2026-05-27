import request from '../utils/request'
import type { LoginParams, RegisterParams, LoginResult, UserInfo } from '../types/auth'

// 登录
export const login = (data: LoginParams): Promise<LoginResult> => {
  return request.post('/auth/login', data)
}

// 注册
export const register = (data: RegisterParams): Promise<void> => {
  return request.post('/auth/register', data)
}

// 获取当前用户信息
export const getCurrentUser = (): Promise<UserInfo> => {
  return request.get('/auth/current')
}

// 退出登录
export const logout = (): Promise<void> => {
  return request.post('/auth/logout')
}

// 修改密码
export const changePassword = (data: { oldPassword: string; newPassword: string }): Promise<void> => {
  return request.post('/auth/change-password', data)
}
