<template>
  <div class="news">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>新闻动态</h1>
        <p>了解社团最新资讯</p>
      </div>
    </section>

    <!-- 新闻列表 -->
    <section class="news-list">
      <div class="container">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-radio-group v-model="activeType" @change="handleFilter">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="news">新闻</el-radio-button>
            <el-radio-button label="notice">通知</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 新闻卡片 -->
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in newsList" :key="item.id">
            <el-card :body-style="{ padding: '0px' }" class="news-card" @click="$router.push(`/news/${item.id}`)">
              <img :src="item.coverImage || '/assets/images/default-cover.png'" class="news-cover">
              <div class="news-content">
                <h3>{{ item.title }}</h3>
                <p class="news-summary">{{ item.summary }}</p>
                <div class="news-meta">
                  <span class="news-type">{{ item.type === 'news' ? '新闻' : '通知' }}</span>
                  <span class="news-views">阅读 {{ item.viewCount }}</span>
                  <span class="news-date">{{ formatDate(item.createdAt) }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="newsList.length === 0" description="暂无新闻"></el-empty>

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
import { getContentList } from '../../api/content'
import type { Content } from '../../types/content'

const newsList = ref<Content[]>([])
const activeType = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const fetchNews = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value,
      status: 'published'
    }
    
    if (activeType.value) {
      params.type = activeType.value
    }
    
    const res = await getContentList(params)
    newsList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch news:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchNews()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchNews()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchNews()
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchNews()
})
</script>

<style scoped>
.news {
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

.news-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-summary {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.news-type {
  background: #667eea;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
}

.pagination {
  margin-top: 40px;
  text-align: center;
}
</style>
