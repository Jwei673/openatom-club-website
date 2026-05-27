<template>
  <div class="admin-dashboard">
    <h2 class="page-title">仪表盘</h2>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stats-card stats-users">
          <div class="stats-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-number">{{ stats.users }}</div>
            <div class="stats-label">总用户数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card stats-activities">
          <div class="stats-icon">
            <el-icon><Calendar /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-number">{{ stats.activities }}</div>
            <div class="stats-label">活动数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card stats-projects">
          <div class="stats-icon">
            <el-icon><FolderOpened /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-number">{{ stats.projects }}</div>
            <div class="stats-label">项目数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="6">
        <el-card class="stats-card stats-pending">
          <div class="stats-icon">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-number">{{ stats.pendingApprovals }}</div>
            <div class="stats-label">待审批</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 待办事项 -->
    <el-row :gutter="20" class="content-row">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>待审批申请</span>
              <el-button type="text" @click="$router.push('/admin/approvals')">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="pendingApprovals" style="width: 100%">
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="applicantName" label="申请人" width="120" />
            <el-table-column prop="type" label="类型" width="100" />
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button type="text" @click="$router.push('/admin/approvals')">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <el-empty v-if="pendingApprovals.length === 0" description="暂无待审批申请"></el-empty>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
              <el-button type="text" @click="$router.push('/admin/activities')">查看全部</el-button>
            </div>
          </template>
          
          <el-table :data="recentActivities" style="width: 100%">
            <el-table-column prop="title" label="活动名称" />
            <el-table-column prop="startTime" label="开始时间" width="180" />
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)" size="small">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          
          <el-empty v-if="recentActivities.length === 0" description="暂无活动"></el-empty>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Calendar, FolderOpened, Bell } from '@element-plus/icons-vue'

const stats = ref({
  users: 0,
  activities: 0,
  projects: 0,
  pendingApprovals: 0
})

const pendingApprovals = ref<any[]>([])
const recentActivities = ref<any[]>([])

const fetchStats = async () => {
  // TODO: 调用后端API获取统计数据
  stats.value = {
    users: 256,
    activities: 12,
    projects: 8,
    pendingApprovals: 3
  }
}

const fetchPendingApprovals = async () => {
  // TODO: 调用后端API获取待审批申请
  pendingApprovals.value = [
    { id: 1, title: '张三申请加入社团', applicantName: '张三', type: '加入社团' },
    { id: 2, title: '李四申请创建项目', applicantName: '李四', type: '项目' }
  ]
}

const fetchRecentActivities = async () => {
  // TODO: 调用后端API获取最近活动
  recentActivities.value = [
    { id: 1, title: 'OpenHarmony技术分享会', startTime: '2024-01-15 14:00', status: 'upcoming' },
    { id: 2, title: '开源项目实战训练', startTime: '2024-01-20 09:00', status: 'upcoming' }
  ]
}

const getStatusType = (status: string) => {
  const map: any = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  fetchStats()
  fetchPendingApprovals()
  fetchRecentActivities()
})
</script>

<style scoped>
.admin-dashboard {
  padding: 20px;
}

.page-title {
  font-size: 28px;
  margin-bottom: 20px;
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  position: relative;
  overflow: hidden;
}

.stats-card.stats-users {
  border-top: 3px solid #409eff;
}

.stats-card.stats-activities {
  border-top: 3px solid #67c23a;
}

.stats-card.stats-projects {
  border-top: 3px solid #e6a23c;
}

.stats-card.stats-pending {
  border-top: 3px solid #f56c6c;
}

.stats-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 48px;
  opacity: 0.2;
  color: #409eff;
}

.stats-info {
  padding-right: 60px;
}

.stats-number {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stats-label {
  font-size: 14px;
  color: #909399;
}

.content-row {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
