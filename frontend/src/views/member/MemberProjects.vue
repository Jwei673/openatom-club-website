<template>
  <div class="member-projects">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的项目</span>
          <el-button type="primary" @click="$router.push('/projects')">
            浏览项目
          </el-button>
        </div>
      </template>
      
      <!-- 项目列表 -->
      <el-table :data="projectList" style="width: 100%">
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="text" @click="$router.push(`/projects/${scope.row.id}`)">
              查看详情
            </el-button>
            <el-button 
              v-if="scope.row.status === 'recruiting'" 
              type="text" 
              @click="handleLeave(scope.row.id)"
            >
              退出项目
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <el-empty v-if="projectList.length === 0" description="暂无参与项目"></el-empty>
      
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
import { getMyProjects, leaveProject } from '../../api/project'
import type { Project } from '../../types/project'
import { ElMessage, ElMessageBox } from 'element-plus'

const projectList = ref<Project[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const fetchMyProjects = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    const res = await getMyProjects(params)
    projectList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch my projects:', error)
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchMyProjects()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchMyProjects()
}

const handleLeave = (id: number) => {
  ElMessageBox.confirm('确定要退出该项目吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await leaveProject(id)
      ElMessage.success('退出成功')
      fetchMyProjects()
    } catch (error: any) {
      ElMessage.error(error.message || '退出失败')
    }
  }).catch(() => {})
}

const getStatusType = (status: string) => {
  const map: any = {
    recruiting: 'warning',
    developing: 'primary',
    completed: 'success'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = {
    recruiting: '招募中',
    developing: '开发中',
    completed: '已完成'
  }
  return map[status] || status
}

onMounted(() => {
  fetchMyProjects()
})
</script>

<style scoped>
.member-projects {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
