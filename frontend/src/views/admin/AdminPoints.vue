<template>
  <div class="admin-points">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>积分管理</span>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-input 
          v-model="searchUserId" 
          placeholder="搜索用户ID"
          style="width: 200px;"
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
          v-model="filterType" 
          placeholder="类型筛选"
          style="width: 150px; margin-left: 10px;"
          clearable
          @change="handleSearch"
        >
          <el-option label="活动" value="activity" />
          <el-option label="项目" value="project" />
          <el-option label="贡献" value="contribution" />
          <el-option label="奖励" value="reward" />
          <el-option label="惩罚" value="penalty" />
        </el-select>
      </div>
      
      <!-- 积分记录表格 -->
      <el-table :data="pointsList" style="width: 100%">
        <el-table-column prop="userName" label="用户" width="120" />
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)" size="small">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="80" />
        <el-table-column prop="description" label="描述" show-overflow-tooltip />
        <el-table-column prop="createdAt" label="时间" width="180" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="scope">
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
      <el-empty v-if="pointsList.length === 0" description="暂无积分记录"></el-empty>
      
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
    
    <!-- 添加积分记录对话框 -->
    <el-dialog 
      v-model="showAddDialog" 
      title="添加积分记录"
      width="500px"
    >
      <el-form :model="newPointsRecord" label-width="80px">
        <el-form-item label="用户">
          <el-select 
            v-model="newPointsRecord.userId" 
            placeholder="请选择用户"
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
        <el-form-item label="积分">
          <el-input-number 
            v-model="newPointsRecord.points" 
            :min="-1000" 
            :max="1000"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="newPointsRecord.type" placeholder="请选择类型">
            <el-option label="活动" value="activity" />
            <el-option label="项目" value="project" />
            <el-option label="贡献" value="contribution" />
            <el-option label="奖励" value="reward" />
            <el-option label="惩罚" value="penalty" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="newPointsRecord.description" 
            type="textarea" 
            :rows="3"
            placeholder="请输入描述" 
          />
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
import { getPointsRecordList, addPointsRecord, deletePointsRecord } from '../../api/points'
import type { PointsRecord, PointsQuery } from '../../types/points'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const pointsList = ref<PointsRecord[]>([])
const userList = ref<any[]>([])
const searchUserId = ref('')
const filterType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showAddDialog = ref(false)
const newPointsRecord = ref<Partial<PointsRecord>>({})

const fetchPointsRecords = async () => {
  try {
    const params: PointsQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (searchUserId.value) {
      params.userId = parseInt(searchUserId.value)
    }
    
    if (filterType.value) {
      params.type = filterType.value
    }
    
    const res = await getPointsRecordList(params)
    pointsList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch points records:', error)
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

const handleSearch = () => {
  currentPage.value = 1
  fetchPointsRecords()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchPointsRecords()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPointsRecords()
}

const handleAdd = () => {
  newPointsRecord.value = { points: 0, type: 'activity' }
  showAddDialog.value = true
}

const handleSave = async () => {
  try {
    await addPointsRecord(newPointsRecord.value)
    ElMessage.success('添加成功')
    showAddDialog.value = false
    fetchPointsRecords()
  } catch (error: any) {
    ElMessage.error(error.message || '添加失败')
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该积分记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用删除API
    ElMessage.success('删除成功')
    fetchPointsRecords()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const getTypeType = (type: string) => {
  const map: any = {
    activity: 'primary',
    project: 'success',
    contribution: 'warning',
    reward: 'danger',
    penalty: 'info'
  }
  return map[type] || 'info'
}

const getTypeText = (type: string) => {
  const map: any = {
    activity: '活动',
    project: '项目',
    contribution: '贡献',
    reward: '奖励',
    penalty: '惩罚'
  }
  return map[type] || type
}

onMounted(() => {
  fetchPointsRecords()
  fetchUsers()
})
</script>

<style scoped>
.admin-points {
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
  display: flex;
  align-items: center;
}
</style>