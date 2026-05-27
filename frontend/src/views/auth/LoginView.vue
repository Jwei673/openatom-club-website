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
          <h2>欢迎回来</h2>
          <p class="subtitle">登录您的账号以继续使用</p>
          
          <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-position="top">
            <el-form-item label="用户名" prop="username">
              <el-input 
                v-model="loginForm.username" 
                placeholder="请输入用户名"
                prefix-icon="User"
                size="large"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input 
                v-model="loginForm.password" 
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                size="large"
                show-password
              />
            </el-form-item>
            
            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                :loading="loading"
                @click="handleLogin"
                style="width: 100%"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          
          <div class="auth-footer">
            <span>还没有账号？</span>
            <el-button type="text" @click="$router.push('/auth/register')">立即注册</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../api/auth'
import type { LoginParams } from '../../types/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive<LoginParams>({
  username: '',
  password: ''
})

const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res = await login(loginForm)
        // 保存token和用户信息
        localStorage.setItem('token', res.token)
        localStorage.setItem('userRole', res.user.role)
        localStorage.setItem('username', res.user.username)
        
        ElMessage.success('登录成功！')
        
        // 根据角色跳转
        if (res.user.role === 'admin' || res.user.role === 'president') {
          router.push('/admin')
        } else {
          router.push('/member')
        }
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
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
  padding: 60px 40px;
  display: flex;
  align-items: center;
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
  margin-bottom: 40px;
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
