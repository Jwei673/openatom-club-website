<template>
  <div class="admin-layout">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo" @click="$router.push('/')">
          <img src="/assets/images/club-logo.png" alt="logo" class="logo-img">
          <span class="logo-text">开放原子开源社团 - 管理后台</span>
        </div>
        
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-name">
              <el-avatar :size="32" class="user-avatar">管</el-avatar>
              管理员
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

    <el-container class="main-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/admin">
            <el-icon><DataLine /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          
          <el-sub-menu index="user-management">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/admin/users">用户列表</el-menu-item>
            <el-menu-item index="/admin/departments">部门管理</el-menu-item>
          </el-sub-menu>
          
          <el-menu-item index="/admin/contents">
            <el-icon><Document /></el-icon>
            <span>内容管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/activities">
            <el-icon><Calendar /></el-icon>
            <span>活动管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/projects">
            <el-icon><FolderOpened /></el-icon>
            <span>项目管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/approvals">
            <el-icon><Check /></el-icon>
            <span>审批管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/points">
            <el-icon><Trophy /></el-icon>
            <span>积分管理</span>
          </el-menu-item>
          
          <el-menu-item index="/admin/settings">
            <el-icon><Setting /></el-icon>
            <span>系统设置</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主要内容区 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ArrowDown, DataLine, User, Document, Calendar, FolderOpened, Check, Trophy, Setting } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const activeMenu = route.path

const handleCommand = (command: string) => {
  if (command === 'profile') {
    router.push('/admin')
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
.admin-layout {
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

.main-container {
  padding-top: 60px;
}

.sidebar {
  background: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  overflow-y: auto;
}

.sidebar-menu {
  border: none;
}

.main-content {
  margin-left: 200px;
  padding: 20px;
  min-height: calc(100vh - 60px);
}
</style>
