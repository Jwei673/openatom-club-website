<template>
  <div class="member-profile">
    <el-row :gutter="20">
      <!-- 个人信息卡片 -->
      <el-col :span="8">
        <el-card class="profile-card">
          <div class="avatar-section">
            <el-avatar :size="120" class="profile-avatar">{{ userInfo.realName?.charAt(0) }}</el-avatar>
            <h2>{{ userInfo.realName }}</h2>
            <p class="student-id">{{ userInfo.studentId }}</p>
          </div>
          
          <div class="info-section">
            <div class="info-item">
              <span class="label">用户名</span>
              <span class="value">{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <span class="label">邮箱</span>
              <span class="value">{{ userInfo.email }}</span>
            </div>
            <div class="info-item">
              <span class="label">手机号</span>
              <span class="value">{{ userInfo.phone }}</span>
            </div>
            <div class="info-item">
              <span class="label">部门</span>
              <span class="value">{{ userInfo.departmentName }}</span>
            </div>
            <div class="info-item">
              <span class="label">职位</span>
              <span class="value">{{ userInfo.position || '成员' }}</span>
            </div>
            <div class="info-item">
              <span class="label">积分</span>
              <span class="value points">{{ userInfo.points || 0 }}</span>
            </div>
            <div class="info-item">
              <span class="label">状态</span>
              <el-tag :type="userInfo.status === 'active' ? 'success' : 'danger'" size="small">
                {{ userInfo.status === 'active' ? '正常' : '禁用' }}
              </el-tag>
            </div>
          </div>
          
          <el-button type="primary" style="width: 100%; margin-top: 20px;" @click="editing = true">
            编辑资料
          </el-button>
        </el-card>
      </el-col>
      
      <!-- 最近活动 -->
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>最近活动</span>
            </div>
          </template>
          
          <el-empty description="暂无最近活动"></el-empty>
        </el-card>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>参与项目</span>
            </div>
          </template>
          
          <el-empty description="暂无参与项目"></el-empty>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 编辑资料对话框 -->
    <el-dialog v-model="editing" title="编辑资料" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editing = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCurrentUser } from '../../api/auth'
import type { UserInfo } from '../../types/auth'

const userInfo = ref<UserInfo>({} as UserInfo)
const editing = ref(false)
const editForm = ref({
  email: '',
  phone: ''
})

const fetchUserInfo = async () => {
  try {
    const res = await getCurrentUser()
    userInfo.value = res
    editForm.value.email = res.email
    editForm.value.phone = res.phone
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  }
}

const handleSave = async () => {
  // TODO: 调用更新用户信息的API
  editing.value = false
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.member-profile {
  padding: 20px;
}

.profile-card {
  text-align: center;
}

.avatar-section {
  padding: 20px 0;
}

.profile-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 48px;
  margin-bottom: 15px;
}

.avatar-section h2 {
  font-size: 24px;
  margin-bottom: 5px;
}

.student-id {
  color: #909399;
  font-size: 14px;
}

.info-section {
  text-align: left;
  padding: 20px 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: #909399;
}

.value {
  color: #303133;
  font-weight: 500;
}

.value.points {
  color: #667eea;
  font-size: 18px;
  font-weight: bold;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
