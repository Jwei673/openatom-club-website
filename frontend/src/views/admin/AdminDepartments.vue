<template>
  <div class="admin-departments">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>部门管理</span>
          <el-button type="primary" @click="handleAdd">
            添加部门
          </el-button>
        </div>
      </template>
      
      <!-- 部门列表 -->
      <el-table :data="departmentList" style="width: 100%">
        <el-table-column prop="name" label="部门名称" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="leaderName" label="负责人" width="120" />
        <el-table-column prop="memberCount" label="成员数" width="100" />
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
      <el-empty v-if="departmentList.length === 0" description="暂无部门"></el-empty>
    </el-card>
    
    <!-- 添加/编辑部门对话框 -->
    <el-dialog 
      v-model="showDialog" 
      :title="editingDept.id ? '编辑部门' : '添加部门'"
      width="500px"
    >
      <el-form :model="editingDept" label-width="80px">
        <el-form-item label="部门名称">
          <el-input v-model="editingDept.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="editingDept.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入部门描述" 
          />
        </el-form-item>
        <el-form-item label="负责人">
          <el-select 
            v-model="editingDept.leaderId" 
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
import { ElMessage, ElMessageBox } from 'element-plus'

interface Department {
  id?: number
  name: string
  description: string
  leaderId: number | null
  leaderName?: string
  memberCount?: number
  createdAt?: string
}

interface User {
  id: number
  realName: string
}

const departmentList = ref<Department[]>([])
const userList = ref<User[]>([])
const showDialog = ref(false)
const editingDept = ref<Partial<Department>>({})

const fetchDepartments = async () => {
  try {
    // TODO: 调用后端API获取部门列表
    departmentList.value = [
      { id: 1, name: '技术部', description: '负责技术研究和开发', leaderName: '张三', memberCount: 30, createdAt: '2024-01-01 10:00:00' },
      { id: 2, name: '项目部', description: '负责项目管理和协调', leaderName: '李四', memberCount: 20, createdAt: '2024-01-01 10:00:00' },
      { id: 3, name: '运营部', description: '负责日常运营和宣传', leaderName: '王五', memberCount: 15, createdAt: '2024-01-01 10:00:00' }
    ]
  } catch (error) {
    console.error('Failed to fetch departments:', error)
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

const handleAdd = () => {
  editingDept.value = { leaderId: null }
  showDialog.value = true
}

const handleEdit = (dept: Department) => {
  editingDept.value = { ...dept }
  showDialog.value = true
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用后端API删除部门
    ElMessage.success('删除成功')
    fetchDepartments()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    // TODO: 调用后端API保存部门
    if (editingDept.value.id) {
      ElMessage.success('更新成功')
    } else {
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    fetchDepartments()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

onMounted(() => {
  fetchDepartments()
  fetchUsers()
})
</script>

<style scoped>
.admin-departments {
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
