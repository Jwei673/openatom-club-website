import request from '../utils/request'
import type { PointsRecord, PointsQuery, PageResult } from '../types/points'

// 获取积分记录列表
export const getPointsRecordList = (params: PointsQuery): Promise<PageResult<PointsRecord>> => {
  return request.get('/points', { params })
}

// 获取用户积分总和
export const getUserPoints = (userId: number): Promise<number> => {
  return request.get(`/points/user/${userId}`)
}

// 获取积分排行榜
export const getPointsRanking = (params: any): Promise<PageResult<any>> => {
  return request.get('/points/ranking', { params })
}

// 添加积分记录（管理员）
export const addPointsRecord = (data: Partial<PointsRecord>): Promise<PointsRecord> => {
  return request.post('/points', data)
}

// 删除积分记录（管理员）
export const deletePointsRecord = (id: number): Promise<void> => {
  return request.delete(`/points/${id}`)
}
