<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="hero-content">
        <h1>开放原子开源社团</h1>
        <p>电子科技大学成都学院 · 探索开源世界，共创技术未来</p>
        <div class="hero-buttons">
          <el-button type="primary" size="large" @click="$router.push('/about')">了解我们</el-button>
          <el-button size="large" @click="$router.push('/activities')">参与活动</el-button>
        </div>
      </div>
    </section>

    <!-- 社团简介 -->
    <section class="intro">
      <div class="container">
        <h2>关于我们</h2>
        <p>开放原子开源社团成立于2020年，是电子科技大学成都学院最具活力的技术社团之一。我们致力于推广开源文化，培养开发者的技术能力，推动校园开源生态的发展。</p>
        <el-row :gutter="20" class="stats">
          <el-col :span="6">
            <div class="stat-item">
              <h3>200+</h3>
              <p>社团成员</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <h3>50+</h3>
              <p>开源项目</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <h3>100+</h3>
              <p>举办活动</p>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-item">
              <h3>30+</h3>
              <p>企业合作</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 最新新闻 -->
    <section class="news">
      <div class="container">
        <h2>新闻动态</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in newsList" :key="item.id">
            <el-card :body-style="{ padding: '0px' }" class="news-card" @click="$router.push(`/news/${item.id}`)">
              <img :src="item.coverImage" class="news-cover">
              <div class="news-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
                <span class="news-date">{{ item.createdAt }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="section-more">
          <el-button @click="$router.push('/news')">查看更多新闻</el-button>
        </div>
      </div>
    </section>

    <!-- 近期活动 -->
    <section class="activities">
      <div class="container">
        <h2>近期活动</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in activityList" :key="item.id">
            <el-card class="activity-card" @click="$router.push(`/activities/${item.id}`)">
              <h3>{{ item.title }}</h3>
              <p class="activity-time">时间：{{ item.startTime }}</p>
              <p class="activity-location">地点：{{ item.location }}</p>
              <p class="activity-desc">{{ item.description }}</p>
              <el-button type="primary" size="small">立即报名</el-button>
            </el-card>
          </el-col>
        </el-row>
        <div class="section-more">
          <el-button @click="$router.push('/activities')">查看更多活动</el-button>
        </div>
      </div>
    </section>

    <!-- 开源项目 -->
    <section class="projects">
      <div class="container">
        <h2>开源项目</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in projectList" :key="item.id">
            <el-card class="project-card" @click="$router.push(`/projects/${item.id}`)">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <div class="project-meta">
                <span>负责人：{{ item.leaderName }}</span>
                <span>状态：{{ item.status }}</span>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div class="section-more">
          <el-button @click="$router.push('/projects')">查看更多项目</el-button>
        </div>
      </div>
    </section>

    <!-- 加入我们 -->
    <section class="join">
      <div class="container">
        <h2>加入我们</h2>
        <p>如果你对开源技术充满热情，欢迎加入我们的大家庭！</p>
        <el-button type="primary" size="large" @click="$router.push('/auth/register')">立即加入</el-button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContentList } from '../../api/content'
import { getActivityList } from '../../api/activity'
import { getProjectList } from '../../api/project'
import type { Content, Activity, Project } from '../../types'

const newsList = ref<Content[]>([])
const activityList = ref<Activity[]>([])
const projectList = ref<Project[]>([])

onMounted(async () => {
  // 获取最新新闻
  const newsRes = await getContentList({ page: 1, size: 3, type: 'news', status: 'published' })
  newsList.value = newsRes.records

  // 获取近期活动
  const activityRes = await getActivityList({ page: 1, size: 3, status: 'upcoming' })
  activityList.value = activityRes.records

  // 获取热门项目
  const projectRes = await getProjectList({ page: 1, size: 3, status: 'developing' })
  projectList.value = projectRes.records
})
</script>

<style scoped>
.home {
  padding-top: 60px;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 0;
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 40px;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
}

.intro {
  background: #f5f7fa;
}

.stats {
  margin-top: 40px;
  text-align: center;
}

.stat-item h3 {
  font-size: 48px;
  color: #667eea;
  margin-bottom: 10px;
}

.stat-item p {
  font-size: 18px;
  color: #666;
}

.news-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.news-card:hover {
  transform: translateY(-5px);
}

.news-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 20px;
}

.news-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.news-content p {
  color: #666;
  margin-bottom: 10px;
}

.news-date {
  color: #999;
  font-size: 14px;
}

.activity-card, .project-card {
  cursor: pointer;
  transition: transform 0.3s;
  height: 100%;
}

.activity-card:hover, .project-card:hover {
  transform: translateY(-5px);
}

.activity-time, .activity-location {
  color: #666;
  margin: 10px 0;
}

.activity-desc {
  color: #999;
  margin-bottom: 15px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
  margin-top: 15px;
}

.section-more {
  text-align: center;
  margin-top: 40px;
}

.join {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
}

.join h2 {
  color: white;
}

.join p {
  font-size: 20px;
  margin-bottom: 30px;
}
</style>
