import request from '../utils/request'
import type { Approval, ApprovalQuery, PageResult } from '../types/approval'

// 获取审批列表
export const getApprovalList = (params: ApprovalQuery): Promise<PageResult<Approval>> => {
  return request.get('/approvals', { params })
}

// 获取审批详情
export const getApprovalDetail = (id: number): Promise<Approval> => {
  return request.get(`/approvals/${id}`)
}

// 提交审批申请
export const submitApproval = (data: Partial<Approval>): Promise<Approval> => {
  return request.post('/approvals', data)
}

// 审批通过
export const approve = (id: number, comment: string): Promise<void> => {
  return request.post(`/approvals/${id}/approve`, { comment })
}

// 审批拒绝
export const reject = (id: number, comment: string): Promise<void> => {
  return request.post(`/approvals/${id}/reject`, { comment })
}

// 获取我的审批
export const getMyApprovals = (params: any): Promise<PageResult<Approval>> => {
  return request.get('/approvals/my', { params })
}
