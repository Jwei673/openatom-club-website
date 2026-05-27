import request from '../utils/request'
import type { Project, ProjectQuery, PageResult, ProjectMember } from '../types/project'

// 获取项目列表
export const getProjectList = (params: ProjectQuery): Promise<PageResult<Project>> => {
  return request.get('/projects', { params })
}

// 获取项目详情
export const getProjectDetail = (id: number): Promise<Project> => {
  return request.get(`/projects/${id}`)
}

// 创建项目
export const createProject = (data: Partial<Project>): Promise<Project> => {
  return request.post('/projects', data)
}

// 更新项目
export const updateProject = (id: number, data: Partial<Project>): Promise<Project> => {
  return request.put(`/projects/${id}`, data)
}

// 删除项目
export const deleteProject = (id: number): Promise<void> => {
  return request.delete(`/projects/${id}`)
}

// 加入项目
export const joinProject = (id: number, role: string): Promise<ProjectMember> => {
  return request.post(`/projects/${id}/join`, { role })
}

// 退出项目
export const leaveProject = (id: number): Promise<void> => {
  return request.delete(`/projects/${id}/leave`)
}

// 获取我参与的项目
export const getMyProjects = (params: any): Promise<PageResult<Project>> => {
  return request.get('/projects/my', { params })
}
