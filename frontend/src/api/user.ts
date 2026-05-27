import request from '../utils/request'
import type { User, UserQuery, PageResult } from '../types/user'

// 获取用户列表
export const getUserList = (params: UserQuery): Promise<PageResult<User>> => {
  return request.get('/users', { params })
}

// 获取用户详情
export const getUserDetail = (id: number): Promise<User> => {
  return request.get(`/users/${id}`)
}

// 创建用户
export const createUser = (data: Partial<User>): Promise<User> => {
  return request.post('/users', data)
}

// 更新用户
export const updateUser = (id: number, data: Partial<User>): Promise<User> => {
  return request.put(`/users/${id}`, data)
}

// 删除用户
export const deleteUser = (id: number): Promise<void> => {
  return request.delete(`/users/${id}`)
}

// 更新用户状态
export const updateUserStatus = (id: number, status: string): Promise<void> => {
  return request.patch(`/users/${id}/status`, { status })
}

// 更新用户积分
export const updateUserPoints = (id: number, points: number, type: string, description: string): Promise<void> => {
  return request.post(`/users/${id}/points`, { points, type, description })
}
