<template>
  <div class="admin-projects">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>项目管理</span>
          <el-button type="primary" @click="handleAdd">
            创建项目
          </el-button>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="activeStatus" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="recruiting">招募中</el-radio-button>
          <el-radio-button label="developing">开发中</el-radio-button>
          <el-radio-button label="completed">已完成</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 项目表格 -->
      <el-table :data="projectList" style="width: 100%">
        <el-table-column prop="name" label="项目名称" show-overflow-tooltip />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="leaderName" label="负责人" width="120" />
        <el-table-column label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              type="text" 
              @click="handleDelete(scope.row.id)"
              style="color: #f56c6c;"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <el-empty v-if="projectList.length === 0" description="暂无项目"></el-empty>
      
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
    
    <!-- 添加/编辑项目对话框 -->
    <el-dialog 
      v-model="showDialog" 
      :title="editingProject.id ? '编辑项目' : '创建项目'"
      width="800px"
    >
      <el-form :model="editingProject" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="editingProject.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input 
            v-model="editingProject.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入项目描述" 
          />
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="editingProject.coverImage" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-form-item label="代码仓库">
          <el-input v-model="editingProject.repositoryUrl" placeholder="请输入代码仓库URL" />
        </el-form-item>
        <el-form-item label="演示地址">
          <el-input v-model="editingProject.demoUrl" placeholder="请输入演示地址URL" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select 
            v-model="editingProject.leaderId" 
            placeholder="请选择负责人"
            filterable
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.realName"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editingProject.status" placeholder="请选择状态">
            <el-option label="招募中" value="recruiting" />
            <el-option label="开发中" value="developing" />
            <el-option label="已完成" value="completed" />
          </el-select>
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
import { getProjectList, createProject, updateProject, deleteProject } from '../../api/project'
import type { Project, ProjectQuery } from '../../types/project'
import { ElMessage, ElMessageBox } from 'element-plus'

const projectList = ref<Project[]>([])
const userList = ref<any[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showDialog = ref(false)
const editingProject = ref<Partial<Project>>({})

const fetchProjects = async () => {
  try {
    const params: ProjectQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getProjectList(params)
    projectList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

const fetchUsers = async () => {
  try {
    // TODO: 调用后端API获取用户列表
    userList.value = [
      { id: 1, realName: '张三' },
      { id: 2, realName: '李四' },
      { id: 3, realName: '王五' }
    ]
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchProjects()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchProjects()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchProjects()
}

const handleAdd = () => {
  editingProject.value = { 
    status: 'recruiting'
  }
  showDialog.value = true
}

const handleEdit = (project: Project) => {
  editingProject.value = { ...project }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingProject.value.id) {
      await updateProject(editingProject.value.id, editingProject.value)
      ElMessage.success('更新成功')
    } else {
      await createProject(editingProject.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    fetchProjects()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该项目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteProject(id)
    ElMessage.success('删除成功')
    fetchProjects()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
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
  fetchProjects()
  fetchUsers()
})
</script>

<style scoped>
.admin-projects {
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
