<template>
  <div class="news-detail">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <el-button @click="$router.back()" icon="ArrowLeft" class="back-btn">返回列表</el-button>
        <h1>{{ news.title }}</h1>
        <div class="news-meta">
          <span class="author">作者：{{ news.authorName }}</span>
          <span class="date">发布时间：{{ formatDate(news.publishedAt) }}</span>
          <span class="views">阅读：{{ news.viewCount }}</span>
        </div>
      </div>
    </section>

    <!-- 新闻内容 -->
    <section class="news-content">
      <div class="container">
        <el-row :gutter="40">
          <el-col :span="18">
            <div class="content-body" v-html="news.content"></div>
            
            <!-- 点赞分享 -->
            <div class="content-actions">
              <el-button type="primary" icon="Thumb">点赞</el-button>
              <el-button icon="Share">分享</el-button>
            </div>
            
            <!-- 评论区 -->
            <div class="comments-section">
              <h3>评论区</h3>
              <el-empty description="暂无评论"></el-empty>
            </div>
          </el-col>
          <el-col :span="6">
            <!-- 侧边栏 -->
            <div class="sidebar">
              <h3>相关推荐</h3>
              <ul class="related-list">
                <li v-for="item in relatedNews" :key="item.id" @click="$router.push(`/news/${item.id}`)">
                  {{ item.title }}
                </li>
              </ul>
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
import { getContentDetail } from '../../api/content'
import type { Content } from '../../types/content'

const route = useRoute()
const news = ref<Content>({} as Content)
const relatedNews = ref<Content[]>([])

const fetchNewsDetail = async (id: number) => {
  try {
    const res = await getContentDetail(id)
    news.value = res
    document.title = res.title
  } catch (error) {
    console.error('Failed to fetch news detail:', error)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  const id = parseInt(route.params.id as string)
  if (id) {
    fetchNewsDetail(id)
  }
})
</script>

<style scoped>
.news-detail {
  padding-top: 60px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
}

.back-btn {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-header h1 {
  font-size: 36px;
  margin-bottom: 20px;
}

.news-meta {
  display: flex;
  gap: 30px;
  font-size: 14px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.content-body {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  line-height: 1.8;
  font-size: 16px;
}

.content-body img {
  max-width: 100%;
  height: auto;
}

.content-actions {
  margin-top: 30px;
  display: flex;
  gap: 15px;
}

.comments-section {
  margin-top: 50px;
}

.sidebar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.sidebar h3 {
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #667eea;
}

.related-list {
  list-style: none;
  padding: 0;
}

.related-list li {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: color 0.3s;
}

.related-list li:hover {
  color: #667eea;
}
</style>
