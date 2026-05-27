<template>
  <div class="member-layout">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <img src="/assets/images/club-logo.png" alt="logo" class="logo-img">
          <span class="logo-text">开放原子开源社团</span>
        </div>
        
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-menu"
        >
          <el-menu-item index="/member">个人中心</el-menu-item>
          <el-menu-item index="/member/points">我的积分</el-menu-item>
          <el-menu-item index="/member/activities">我的活动</el-menu-item>
          <el-menu-item index="/member/projects">我的项目</el-menu-item>
        </el-menu>
        
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-name">
              <el-avatar :size="32" class="user-avatar">{{ username?.charAt(0) }}</el-avatar>
              {{ username }}
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main class="main-content">
      <div class="container">
        <router-view />
      </div>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const username = ref(localStorage.getItem('username') || '用户')

const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('/member/points')) return '/member/points'
  if (path.includes('/member/activities')) return '/member/activities'
  if (path.includes('/member/projects')) return '/member/projects'
  return '/member'
})

const handleCommand = (command: string) => {
  if (command === 'profile') {
    router.push('/member')
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      ElMessage.success('已退出登录')
      router.push('/auth/login')
    }).catch(() => {})
  }
}
</script>

<style scoped>
.member-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 20px;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 40px;
}

.logo-img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.nav-menu {
  flex: 1;
  border: none;
}

.user-info {
  margin-left: auto;
}

.user-name {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #303133;
}

.user-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.main-content {
  padding-top: 80px;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>
