<template>
  <div class="member-activities">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的活动</span>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="activeStatus" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="registered">已报名</el-radio-button>
          <el-radio-button label="attended">已参加</el-radio-button>
          <el-radio-button label="cancelled">已取消</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 活动列表 -->
      <el-table :data="activityList" style="width: 100%">
        <el-table-column prop="title" label="活动名称" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.registrationStatus)" size="small">
              {{ getStatusText(scope.row.registrationStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" @click="$router.push(`/activities/${scope.row.id}`)">
              查看详情
            </el-button>
            <el-button 
              v-if="scope.row.registrationStatus === 'registered'" 
              type="text" 
              @click="handleCancel(scope.row.id)"
            >
              取消报名
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <el-empty v-if="activityList.length === 0" description="暂无活动"></el-empty>
      
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyActivities, cancelActivityRegistration } from '../../api/activity'
import { ElMessage, ElMessageBox } from 'element-plus'

const activityList = ref<any[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchMyActivities = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getMyActivities(params)
    activityList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch my activities:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchMyActivities()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchMyActivities()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchMyActivities()
}

const handleCancel = (id: number) => {
  ElMessageBox.confirm('确定要取消报名吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await cancelActivityRegistration(id)
      ElMessage.success('取消报名成功')
      fetchMyActivities()
    } catch (error: any) {
      ElMessage.error(error.message || '取消报名失败')
    }
  }).catch(() => {})
}

const getStatusType = (status: string) => {
  const map: any = {
    registered: 'primary',
    attended: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = {
    registered: '已报名',
    attended: '已参加',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  fetchMyActivities()
})
</script>

<style scoped>
.member-activities {
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
</style>
