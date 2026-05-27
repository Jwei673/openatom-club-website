<template>
  <div class="activity-detail">
    <!-- 页面标题 -->
    <section class="page-header" :style="{ backgroundImage: `url(${activity.coverImage})` }">
      <div class="overlay"></div>
      <div class="container">
        <el-button @click="$router.back()" icon="ArrowLeft" class="back-btn">返回列表</el-button>
        <h1>{{ activity.title }}</h1>
        <div class="activity-meta">
          <span><el-icon><Calendar /></el-icon> {{ formatDate(activity.startTime) }}</span>
          <span><el-icon><Location /></el-icon> {{ activity.location }}</span>
          <span><el-icon><User /></el-icon> {{ activity.currentParticipants }}/{{ activity.maxParticipants }}人</span>
        </div>
      </div>
    </section>

    <!-- 活动详情 -->
    <section class="activity-content">
      <div class="container">
        <el-row :gutter="40">
          <el-col :span="18">
            <div class="content-body">
              <h2>活动介绍</h2>
              <p>{{ activity.description }}</p>
              <div v-html="activity.content"></div>
            </div>
            
            <!-- 报名按钮 -->
            <div class="action-bar" v-if="activity.status === 'upcoming'">
              <el-button 
                type="primary" 
                size="large" 
                @click="handleRegister"
                :disabled="isRegistered"
                :loading="registering"
              >
                {{ isRegistered ? '已报名' : '立即报名' }}
              </el-button>
            </div>
          </el-col>
          <el-col :span="6">
            <!-- 侧边栏 -->
            <div class="sidebar">
              <div class="info-card">
                <h3>活动信息</h3>
                <ul>
                  <li><strong>开始时间：</strong>{{ formatDate(activity.startTime) }}</li>
                  <li><strong>结束时间：</strong>{{ formatDate(activity.endTime) }}</li>
                  <li><strong>活动地点：</strong>{{ activity.location }}</li>
                  <li><strong>最大人数：</strong>{{ activity.maxParticipants }}人</li>
                  <li><strong>已报名：</strong>{{ activity.currentParticipants }}人</li>
                  <li><strong>积分奖励：</strong>+{{ activity.pointsReward }}</li>
                  <li><strong>状态：</strong>{{ getStatusText(activity.status) }}</li>
                </ul>
              </div>
              
              <div class="organizer-card">
                <h3>组织者</h3>
                <p>{{ activity.organizerName }}</p>
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
import { getActivityDetail, registerActivity, getMyActivities } from '../../api/activity'
import type { Activity } from '../../types/activity'
import { Calendar, Location, User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const activity = ref<Activity>({} as Activity)
const isRegistered = ref(false)
const registering = ref(false)

const fetchActivityDetail = async (id: number) => {
  try {
    const res = await getActivityDetail(id)
    activity.value = res
    document.title = res.title
  } catch (error) {
    console.error('Failed to fetch activity detail:', error)
  }
}

const checkRegistration = async (id: number) => {
  try {
    const res = await getMyActivities({ page: 1, size: 100 })
    const registered = res.records.some((item: any) => item.id === id)
    isRegistered.value = registered
  } catch (error) {
    console.error('Failed to check registration:', error)
  }
}

const handleRegister = async () => {
  if (!localStorage.getItem('token')) {
    ElMessage.warning('请先登录')
    return
  }
  
  registering.value = true
  try {
    await registerActivity(parseInt(route.params.id as string))
    ElMessage.success('报名成功！')
    isRegistered.value = true
    // 刷新活动详情
    await fetchActivityDetail(parseInt(route.params.id as string))
  } catch (error: any) {
    ElMessage.error(error.message || '报名失败')
  } finally {
    registering.value = false
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const getStatusText = (status: string) => {
  const map: any = {
    upcoming: '即将开始',
    ongoing: '进行中',
    completed: '已结束',
    cancelled: '已取消'
  }
  return map[status] || status
}

onMounted(() => {
  const id = parseInt(route.params.id as string)
  if (id) {
    fetchActivityDetail(id)
    checkRegistration(id)
  }
})
</script>

<style scoped>
.activity-detail {
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

.activity-meta {
  display: flex;
  justify-content: center;
  gap: 40px;
  font-size: 18px;
}

.activity-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.activity-content {
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
  margin-bottom: 20px;
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

.info-card, .organizer-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.info-card h3, .organizer-card h3 {
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

.organizer-card p {
  color: #666;
}
</style>
