<template>
  <div class="admin-approvals">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>审批管理</span>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="activeStatus" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="pending">待审批</el-radio-button>
          <el-radio-button label="approved">已通过</el-radio-button>
          <el-radio-button label="rejected">已拒绝</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 审批表格 -->
      <el-table :data="approvalList" style="width: 100%">
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column prop="applicantName" label="申请人" width="120" />
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)" size="small">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="申请时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'pending'" 
              type="text" 
              @click="handleApprove(scope.row)"
            >
              通过
            </el-button>
            <el-button 
              v-if="scope.row.status === 'pending'" 
              type="text" 
              @click="handleReject(scope.row)"
              style="color: #f56c6c;"
            >
              拒绝
            </el-button>
            <el-button type="text" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <el-empty v-if="approvalList.length === 0" description="暂无审批"></el-empty>
      
      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px; text-align: center;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 审批详情/处理对话框 -->
    <el-dialog 
      v-model="showDialog" 
      title="审批详情"
      width="600px"
    >
      <div class="approval-detail" v-if="viewingApproval.id">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="标题">{{ viewingApproval.title }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ viewingApproval.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ getTypeText(viewingApproval.type) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(viewingApproval.status)" size="small">
              {{ getStatusText(viewingApproval.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ viewingApproval.description }}
          </el-descriptions-item>
          <el-descriptions-item label="申请时间" :span="2">
            {{ viewingApproval.createdAt }}
          </el-descriptions-item>
          <el-descriptions-item label="审批意见" :span="2" v-if="viewingApproval.reviewComment">
            {{ viewingApproval.reviewComment }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <el-form v-if="viewingApproval.status === 'pending'" style="margin-top: 20px;">
        <el-form-item label="审批意见">
          <el-input 
            v-model="reviewComment" 
            type="textarea" 
            :rows="3"
            placeholder="请输入审批意见" 
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showDialog = false">关闭</el-button>
        <template v-if="viewingApproval.status === 'pending'">
          <el-button type="primary" @click="handleApprove(viewingApproval)">通过</el-button>
          <el-button type="danger" @click="handleReject(viewingApproval)">拒绝</el-button>
        </template>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getApprovalList, approve, reject } from '../../api/approval'
import type { Approval, ApprovalQuery } from '../../types/approval'
import { ElMessage, ElMessageBox } from 'element-plus'

const approvalList = ref<Approval[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showDialog = ref(false)
const viewingApproval = ref<Approval>({} as Approval)
const reviewComment = ref('')

const fetchApprovals = async () => {
  try {
    const params: ApprovalQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getApprovalList(params)
    approvalList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch approvals:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchApprovals()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchApprovals()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchApprovals()
}

const handleView = (approval: Approval) => {
  viewingApproval.value = { ...approval }
  reviewComment.value = ''
  showDialog.value = true
}

const handleApprove = async (approval: Approval) => {
  try {
    await ElMessageBox.confirm('确定要通过该审批吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await approve(approval.id, reviewComment.value)
    ElMessage.success('审批通过')
    showDialog.value = false
    fetchApprovals()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '审批失败')
    }
  }
}

const handleReject = async (approval: Approval) => {
  if (!reviewComment.value) {
    ElMessage.warning('请输入拒绝原因')
    return
  }
  
  try {
    await ElMessageBox.confirm('确定要拒绝该审批吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await reject(approval.id, reviewComment.value)
    ElMessage.success('已拒绝')
    showDialog.value = false
    fetchApprovals()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '操作失败')
    }
  }
}

const getTypeType = (type: string) => {
  const map: any = {
    join_club: 'primary',
    activity: 'success',
    project: 'warning',
    points: 'danger'
  }
  return map[type] || 'info'
}

const getTypeText = (type: string) => {
  const map: any = {
    join_club: '加入社团',
    activity: '活动',
    project: '项目',
    points: '积分'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: any = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return map[status] || status
}

onMounted(() => {
  fetchApprovals()
})
</script>

<style scoped>
.admin-approvals {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.filter-bar {
  margin-bottom: 20px;
}

.approval-detail {
  margin-top: 20px;
}
</style>
