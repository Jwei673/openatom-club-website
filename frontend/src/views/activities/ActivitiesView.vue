<template>
  <div class="activities">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>活动报名</h1>
        <p>参与社团精彩活动，提升技术能力</p>
      </div>
    </section>

    <!-- 活动列表 -->
    <section class="activities-list">
      <div class="container">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-radio-group v-model="activeStatus" @change="handleFilter">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="upcoming">即将开始</el-radio-button>
            <el-radio-button label="ongoing">进行中</el-radio-button>
            <el-radio-button label="completed">已结束</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 活动卡片 -->
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in activityList" :key="item.id">
            <el-card class="activity-card" @click="$router.push(`/activities/${item.id}`)">
              <img :src="item.coverImage || '/assets/images/default-activity.png'" class="activity-cover">
              <div class="activity-content">
                <h3>{{ item.title }}</h3>
                <div class="activity-meta">
                  <p><el-icon><Calendar /></el-icon> {{ formatDate(item.startTime) }}</p>
                  <p><el-icon><Location /></el-icon> {{ item.location }}</p>
                  <p><el-icon><User /></el-icon> {{ item.currentParticipants }}/{{ item.maxParticipants }}人</p>
                </div>
                <p class="activity-desc">{{ item.description }}</p>
                <div class="activity-footer">
                  <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusText(item.status) }}</el-tag>
                  <span class="points-reward">积分：+{{ item.pointsReward }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="activityList.length === 0" description="暂无活动"></el-empty>

        <!-- 分页 -->
        <div class="pagination" v-if="total > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[9, 12, 15]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getActivityList } from '../../api/activity'
import type { Activity } from '../../types/activity'
import { Calendar, Location, User } from '@element-plus/icons-vue'

const activityList = ref<Activity[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const fetchActivities = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getActivityList(params)
    activityList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch activities:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchActivities()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchActivities()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchActivities()
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const getStatusType = (status: string) => {
  const map: any = {
    upcoming: 'primary',
    ongoing: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return map[status] || 'info'
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
  fetchActivities()
})
</script>

<style scoped>
.activities {
  padding-top: 60px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 48px;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.filter-bar {
  margin-bottom: 30px;
  text-align: center;
}

.activity-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  overflow: hidden;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.activity-content {
  padding: 20px;
}

.activity-content h3 {
  font-size: 18px;
  margin-bottom: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-meta {
  margin-bottom: 15px;
}

.activity-meta p {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.activity-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 15px;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.points-reward {
  font-size: 14px;
  color: #667eea;
  font-weight: bold;
}

.pagination {
  margin-top: 40px;
  text-align: center;
}
</style>
