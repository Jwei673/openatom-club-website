import request from '../utils/request'
import type { Activity, ActivityQuery, PageResult, ActivityRegistration } from '../types/activity'

// 获取活动列表
export const getActivityList = (params: ActivityQuery): Promise<PageResult<Activity>> => {
  return request.get('/activities', { params })
}

// 获取活动详情
export const getActivityDetail = (id: number): Promise<Activity> => {
  return request.get(`/activities/${id}`)
}

// 创建活动
export const createActivity = (data: Partial<Activity>): Promise<Activity> => {
  return request.post('/activities', data)
}

// 更新活动
export const updateActivity = (id: number, data: Partial<Activity>): Promise<Activity> => {
  return request.put(`/activities/${id}`, data)
}

// 删除活动
export const deleteActivity = (id: number): Promise<void> => {
  return request.delete(`/activities/${id}`)
}

// 报名活动
export const registerActivity = (id: number): Promise<ActivityRegistration> => {
  return request.post(`/activities/${id}/register`)
}

// 取消报名
export const cancelActivityRegistration = (id: number): Promise<void> => {
  return request.delete(`/activities/${id}/register`)
}

// 活动签到
export const checkInActivity = (id: number): Promise<void> => {
  return request.post(`/activities/${id}/checkin`)
}

// 获取我报名的活动
export const getMyActivities = (params: any): Promise<PageResult<Activity>> => {
  return request.get('/activities/my', { params })
}
