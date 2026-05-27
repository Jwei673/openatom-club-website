<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-left">
        <img src="/assets/images/club-logo.png" alt="社团logo" class="logo">
        <h1>开放原子开源社团</h1>
        <p>电子科技大学成都学院</p>
        <img src="/assets/images/club-cover.png" alt="社团封面" class="cover">
      </div>
      
      <div class="auth-right">
        <div class="auth-form">
          <h2>加入我们</h2>
          <p class="subtitle">创建您的账号以加入社团</p>
          
          <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="registerForm.username" 
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="registerForm.password" 
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input 
                v-model="registerForm.confirmPassword" 
                type="password"
                placeholder="请再次输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            
            <el-form-item label="真实姓名" prop="realName">
              <el-input 
                v-model="registerForm.realName" 
                placeholder="请输入真实姓名"
                prefix-icon="Edit"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="学号" prop="studentId">
              <el-input 
                v-model="registerForm.studentId" 
                placeholder="请输入学号"
                prefix-icon="Tickets"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="邮箱" prop="email">
              <el-input 
                v-model="registerForm.email" 
                placeholder="请输入邮箱"
                prefix-icon="Message"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="手机号" prop="phone">
              <el-input 
                v-model="registerForm.phone" 
                placeholder="请输入手机号"
                prefix-icon="Phone"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="选择部门" prop="departmentId">
              <el-select 
                v-model="registerForm.departmentId" 
                placeholder="请选择部门"
                size="large"
                style="width: 100%"
              >
                <el-option label="技术部" :value="1" />
                <el-option label="项目部" :value="2" />
                <el-option label="运营部" :value="3" />
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                :loading="loading"
                @click="handleRegister"
                style="width: 100%"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="auth-footer">
            <span>已有账号？</span>
            <el-button type="text" @click="$router.push('/auth/login')">立即登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../api/auth'
import type { RegisterParams } from '../../types/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const registerFormRef = ref()
const loading = ref(false)

const registerForm = reactive<RegisterParams>({
  username: '',
  password: '',
  confirmPassword: '',
  realName: '',
  studentId: '',
  email: '',
  phone: '',
  departmentId: null as any
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ]
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        await register(registerForm)
        ElMessage.success('注册成功！等待管理员审核')
        router.push('/auth/login')
      } catch (error: any) {
        ElMessage.error(error.message || '注册失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-container {
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 1000px;
  width: 100%;
}

.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.auth-left h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.auth-left p {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.cover {
  width: 100%;
  max-width: 300px;
  border-radius: 8px;
}

.auth-right {
  flex: 1;
  padding: 40px;
  display: flex;
  align-items: center;
  overflow-y: auto;
  max-height: 90vh;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-form h2 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #303133;
}

.subtitle {
  color: #909399;
  margin-bottom: 30px;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #909399;
}

.auth-footer .el-button {
  padding: 0;
  margin-left: 5px;
}
</style>
