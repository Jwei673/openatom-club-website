import request from '../utils/request'
import type { Content, ContentQuery, PageResult } from '../types/content'

// 获取内容列表
export const getContentList = (params: ContentQuery): Promise<PageResult<Content>> => {
  return request.get('/contents', { params })
}

// 获取内容详情
export const getContentDetail = (id: number): Promise<Content> => {
  return request.get(`/contents/${id}`)
}

// 创建内容
export const createContent = (data: Partial<Content>): Promise<Content> => {
  return request.post('/contents', data)
}

// 更新内容
export const updateContent = (id: number, data: Partial<Content>): Promise<Content> => {
  return request.put(`/contents/${id}`, data)
}

// 删除内容
export const deleteContent = (id: number): Promise<void> => {
  return request.delete(`/contents/${id}`)
}

// 发布内容
export const publishContent = (id: number): Promise<void> => {
  return request.post(`/contents/${id}/publish`)
}

// 归档内容
export const archiveContent = (id: number): Promise<void> => {
  return request.post(`/contents/${id}/archive`)
}
