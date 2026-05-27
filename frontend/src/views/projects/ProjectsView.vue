<template>
  <div class="projects">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>开源项目</h1>
        <p>探索社团优秀开源项目</p>
      </div>
    </section>

    <!-- 项目列表 -->
    <section class="projects-list">
      <div class="container">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <el-radio-group v-model="activeStatus" @change="handleFilter">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="recruiting">招募中</el-radio-button>
            <el-radio-button label="developing">开发中</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 项目卡片 -->
        <el-row :gutter="20">
          <el-col :span="8" v-for="item in projectList" :key="item.id">
            <el-card class="project-card" @click="$router.push(`/projects/${item.id}`)">
              <img :src="item.coverImage || '/assets/images/default-project.png'" class="project-cover">
              <div class="project-content">
                <h3>{{ item.name }}</h3>
                <p class="project-desc">{{ item.description }}</p>
                <div class="project-meta">
                  <span><el-icon><User /></el-icon> {{ item.leaderName }}</span>
                  <el-tag :type="getStatusType(item.status)" size="small">{{ getStatusText(item.status) }}</el-tag>
                </div>
                <div class="project-links" v-if="item.repositoryUrl || item.demoUrl">
                  <a :href="item.repositoryUrl" target="_blank" @click.stop>
                    <el-icon><Link /></el-icon> 仓库
                  </a>
                  <a :href="item.demoUrl" target="_blank" @click.stop>
                    <el-icon><Monitor /></el-icon> 演示
                  </a>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty v-if="projectList.length === 0" description="暂无项目"></el-empty>

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
import { getProjectList } from '../../api/project'
import type { Project } from '../../types/project'
import { User, Link, Monitor } from '@element-plus/icons-vue'

const projectList = ref<Project[]>([])
const activeStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(9)
const total = ref(0)

const fetchProjects = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeStatus.value) {
      params.status = activeStatus.value
    }
    
    const res = await getProjectList(params)
    projectList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchProjects()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchProjects()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchProjects()
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
  fetchProjects()
})
</script>

<style scoped>
.projects {
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

.project-card {
  cursor: pointer;
  transition: transform 0.3s;
  margin-bottom: 20px;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-content {
  padding: 20px;
}

.project-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 15px;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.project-links {
  display: flex;
  gap: 15px;
}

.project-links a {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #667eea;
  text-decoration: none;
  font-size: 14px;
}

.project-links a:hover {
  text-decoration: underline;
}

.pagination {
  margin-top: 40px;
  text-align: center;
}
</style>
