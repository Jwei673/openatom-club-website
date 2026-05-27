<template>
  <div class="admin-activities">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>活动管理</span>
          <el-button type="primary" @click="handleAdd">
            创建活动
          </el-button>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="activeStatus" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="upcoming">即将开始</el-radio-button>
          <el-radio-button label="ongoing">进行中</el-radio-button>
          <el-radio-button label="completed">已结束</el-radio-button>
          <el-radio-button label="cancelled">已取消</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 活动表格 -->
      <el-table :data="activityList" style="width: 100%">
        <el-table-column prop="title" label="活动名称" show-overflow-tooltip />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="location" label="地点" width="150" />
        <el-table-column prop="currentParticipants" label="报名人数" width="100" />
        <el-table-column prop="pointsReward" label="积分奖励" width="100" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="organizerName" label="组织者" width="120" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              type="text" 
              @click="handleDelete(scope.row.id)"
              style="color: #f56c6c;"
            >
              删除
            </el-button>
            <el-button 
              v-if="scope.row.status === 'upcoming'" 
              type="text" 
              @click="handleCancel(scope.row.id)"
            >
              取消活动
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
    
    <!-- 添加/编辑活动对话框 -->
    <el-dialog 
      v-model="showDialog" 
      :title="editingActivity.id ? '编辑活动' : '创建活动'"
      width="800px"
    >
      <el-form :model="editingActivity" label-width="100px">
        <el-form-item label="活动名称">
          <el-input v-model="editingActivity.title" placeholder="请输入活动名称" />
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input 
            v-model="editingActivity.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入活动描述" 
          />
        </el-form-item>
        <el-form-item label="活动内容">
          <el-input 
            v-model="editingActivity.content" 
            type="textarea" 
            :rows="5"
            placeholder="请输入活动内容" 
          />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="editingActivity.coverImage" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="editingActivity.startTime"
                type="datetime"
                placeholder="选择开始时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="editingActivity.endTime"
                type="datetime"
                placeholder="选择结束时间"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="活动地点">
              <el-input v-model="editingActivity.location" placeholder="请输入活动地点" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最大人数">
              <el-input-number 
                v-model="editingActivity.maxParticipants" 
                :min="1" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="积分奖励">
          <el-input-number 
            v-model="editingActivity.pointsReward" 
            :min="0" 
            :max="1000"
            style="width: 200px;"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getActivityList, createActivity, updateActivity, deleteActivity } from '../../api/activity'
import type { Activity, ActivityQuery } from '../../types/activity'
import { ElMessage, ElMessageBox } from 'element-plus'

const activityList = ref<Activity[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showDialog = ref(false)
const editingActivity = ref<Partial<Activity>>({})

const fetchActivities = async () => {
  try {
    const params: ActivityQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getActivityList(params)
    activityList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchActivities()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchActivities()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchActivities()
}

const handleAdd = () => {
  editingActivity.value = { 
    status: 'upcoming',
    maxParticipants: 100,
    pointsReward: 10
  }
  showDialog.value = true
}

const handleEdit = (activity: Activity) => {
  editingActivity.value = { ...activity }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingActivity.value.id) {
      await updateActivity(editingActivity.value.id, editingActivity.value)
      ElMessage.success('更新成功')
    } else {
      await createActivity(editingActivity.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    fetchActivities()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteActivity(id)
    ElMessage.success('删除成功')
    fetchActivities()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleCancel = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要取消该活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用取消活动API
    ElMessage.success('取消成功')
    fetchActivities()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '取消失败')
    }
  }
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
  fetchActivities()
})
</script>

<style scoped>
.admin-activities {
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
