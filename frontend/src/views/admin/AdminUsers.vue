<template>
  <div class="admin-users">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <el-button type="primary" @click="showAddDialog = true">
            添加用户
          </el-button>
        </div>
      </template>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索用户名/姓名"
          style="width: 300px;"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
        
        <el-select 
          v-model="filterRole" 
          placeholder="角色筛选"
          style="width: 150px; margin-left: 10px;"
          clearable
          @change="handleSearch"
        >
          <el-option label="管理员" value="admin" />
          <el-option label="社长" value="president" />
          <el-option label="成员" value="member" />
        </el-select>
      </div>
      
      <!-- 用户表格 -->
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="realName" label="真实姓名" width="120" />
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="departmentName" label="部门" width="120" />
        <el-table-column prop="position" label="职位" width="100" />
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column label="角色" width="100">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)" size="small">
              {{ getRoleText(scope.row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              type="text" 
              @click="handleToggleStatus(scope.row)"
            >
              {{ scope.row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
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
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      :title="editingUser.id ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="editingUser" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editingUser.username" :disabled="!!editingUser.id" />
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="editingUser.realName" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="editingUser.studentId" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editingUser.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editingUser.phone" />
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="editingUser.departmentId" placeholder="请选择部门">
            <el-option label="技术部" :value="1" />
            <el-option label="项目部" :value="2" />
            <el-option label="运营部" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="editingUser.role" placeholder="请选择角色">
            <el-option label="成员" value="member" />
            <el-option label="管理员" value="admin" />
            <el-option label="社长" value="president" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getUserList, createUser, updateUser, deleteUser, updateUserStatus } from '../../api/user'
import type { User, UserQuery } from '../../types/user'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const userList = ref<User[]>([])
const searchKeyword = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const editingUser = ref<Partial<User>>({})

const fetchUsers = async () => {
  try {
    const params: UserQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchKeyword.value) {
      params.username = searchKeyword.value
      params.realName = searchKeyword.value
    }
    
    if (filterRole.value) {
      params.role = filterRole.value
    }
    
    const res = await getUserList(params)
    userList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchUsers()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchUsers()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchUsers()
}

const handleEdit = (user: User) => {
  editingUser.value = { ...user }
  showAddDialog.value = true
}

const handleToggleStatus = async (user: User) => {
  const newStatus = user.status === 'active' ? 'disabled' : 'active'
  const action = newStatus === 'disabled' ? '禁用' : '启用'
  
  try {
    await ElMessageBox.confirm(`确定要${action}该用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await updateUserStatus(user.id, newStatus)
    ElMessage.success(`${action}成功`)
    fetchUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || `${action}失败`)
    }
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteUser(id)
    ElMessage.success('删除成功')
    fetchUsers()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const handleSave = async () => {
  try {
    if (editingUser.value.id) {
      await updateUser(editingUser.value.id, editingUser.value)
      ElMessage.success('更新成功')
    } else {
      await createUser(editingUser.value)
      ElMessage.success('创建成功')
    }
    showAddDialog.value = false
    fetchUsers()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const getRoleType = (role: string) => {
  const map: any = {
    admin: 'danger',
    president: 'warning',
    member: 'primary'
  }
  return map[role] || 'info'
}

const getRoleText = (role: string) => {
  const map: any = {
    admin: '管理员',
    president: '社长',
    member: '成员'
  }
  return map[role] || role
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
</style>
