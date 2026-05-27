<template>
  <div class="project-detail">
    <!-- 页面标题 -->
    <section class="page-header" :style="{ backgroundImage: `url(${project.coverImage})` }">
      <div class="overlay"></div>
      <div class="container">
        <el-button @click="$router.back()" icon="ArrowLeft" class="back-btn">返回列表</el-button>
        <h1>{{ project.name }}</h1>
        <div class="project-meta">
          <span><el-icon><User /></el-icon> {{ project.leaderName }}</span>
          <el-tag :type="getStatusType(project.status)" size="large">{{ getStatusText(project.status) }}</el-tag>
        </div>
      </div>
    </section>

    <!-- 项目详情 -->
    <section class="project-content">
      <div class="container">
        <el-row :gutter="40">
          <el-col :span="18">
            <div class="content-body">
              <h2>项目介绍</h2>
              <p>{{ project.description }}</p>
              
              <h2>项目链接</h2>
              <div class="project-links">
                <el-button v-if="project.repositoryUrl" type="primary" @click="openLink(project.repositoryUrl)">
                  <el-icon><Link /></el-icon> 代码仓库
                </el-button>
                <el-button v-if="project.demoUrl" @click="openLink(project.demoUrl)">
                  <el-icon><Monitor /></el-icon> 在线演示
                </el-button>
              </div>
            </div>
            
            <!-- 加入项目按钮 -->
            <div class="action-bar" v-if="project.status === 'recruiting'">
              <el-button 
                type="primary" 
                size="large" 
                @click="handleJoin"
                :disabled="isMember"
                :loading="joining"
              >
                {{ isMember ? '已加入' : '加入项目' }}
              </el-button>
            </div>
          </el-col>
          <el-col :span="6">
            <!-- 侧边栏 -->
            <div class="sidebar">
              <div class="info-card">
                <h3>项目信息</h3>
                <ul>
                  <li><strong>负责人：</strong>{{ project.leaderName }}</li>
                  <li><strong>状态：</strong>{{ getStatusText(project.status) }}</li>
                  <li><strong>创建时间：</strong>{{ formatDate(project.createdAt) }}</li>
                </ul>
              </div>
              
              <div class="members-card">
                <h3>项目成员</h3>
                <el-empty :description="`暂无成员信息`"></el-empty>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProjectDetail, joinProject, getMyProjects } from '../../api/project'
import type { Project } from '../../types/project'
import { User, Link, Monitor } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const project = ref<Project>({} as Project)
const isMember = ref(false)
const joining = ref(false)

const fetchProjectDetail = async (id: number) => {
  try {
    const res = await getProjectDetail(id)
    project.value = res
    document.title = res.name
  } catch (error) {
    console.error('Failed to fetch project detail:', error)
  }
}

const checkMembership = async (id: number) => {
  try {
    const res = await getMyProjects({ page: 1, size: 100 })
    const member = res.records.some((item: any) => item.id === id)
    isMember.value = member
  } catch (error) {
    console.error('Failed to check membership:', error)
  }
}

const handleJoin = async () => {
  if (!localStorage.getItem('token')) {
    ElMessage.warning('请先登录')
    return
  }
  
  joining.value = true
  try {
    await joinProject(parseInt(route.params.id as string), 'member')
    ElMessage.success('加入成功！')
    isMember.value = true
  } catch (error: any) {
    ElMessage.error(error.message || '加入失败')
  } finally {
    joining.value = false
  }
}

const openLink = (url: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
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
  const id = parseInt(route.params.id as string)
  if (id) {
    fetchProjectDetail(id)
    checkMembership(id)
  }
})
</script>

<style scoped>
.project-detail {
  padding-top: 60px;
}

.page-header {
  position: relative;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 100px 0;
  text-align: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-header h1 {
  font-size: 48px;
  margin-bottom: 30px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.project-meta {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  font-size: 18px;
}

.project-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-content {
  padding: 60px 0;
  background: #f5f7fa;
}

.content-body {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.content-body h2 {
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.content-body p {
  line-height: 1.8;
  color: #666;
  margin-bottom: 30px;
}

.project-links {
  display: flex;
  gap: 15px;
}

.action-bar {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sidebar {
  position: sticky;
  top: 80px;
}

.info-card, .members-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.info-card h3, .members-card h3 {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.info-card ul {
  list-style: none;
  padding: 0;
}

.info-card li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  line-height: 1.6;
}

.info-card li:last-child {
  border-bottom: none;
}
</style>
