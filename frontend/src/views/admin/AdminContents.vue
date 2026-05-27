<template>
  <div class="admin-contents">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>内容管理</span>
          <el-button type="primary" @click="handleAdd">
            发布内容
          </el-button>
        </div>
      </template>
      
      <!-- 筛选栏 -->
      <div class="filter-bar">
        <el-radio-group v-model="activeType" @change="handleFilter">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="news">新闻</el-radio-button>
          <el-radio-button label="notice">通知</el-radio-button>
          <el-radio-button label="introduction">简介</el-radio-button>
        </el-radio-group>
      </div>
      
      <!-- 内容表格 -->
      <el-table :data="contentList" style="width: 100%">
        <el-table-column prop="title" label="标题" show-overflow-tooltip />
        <el-table-column label="类型" width="100">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)" size="small">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="authorName" label="作者" width="120" />
        <el-table-column prop="viewCount" label="阅读量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" size="small">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="scope">
            <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button 
              v-if="scope.row.status === 'draft'" 
              type="text" 
              @click="handlePublish(scope.row.id)"
            >
              发布
            </el-button>
            <el-button 
              v-if="scope.row.status === 'published'" 
              type="text" 
              @click="handleArchive(scope.row.id)"
            >
              归档
            </el-button>
            <el-button 
              type="text" 
              @click="handleDelete(scope.row.id)"
              style="color: #f56c6c;"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 空状态 -->
      <el-empty v-if="contentList.length === 0" description="暂无内容"></el-empty>
      
      <!-- 分页 -->
      <div class="pagination" style="margin-top: 20px; text-align: center;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑内容对话框 -->
    <el-dialog 
      v-model="showDialog" 
      :title="editingContent.id ? '编辑内容' : '发布内容'"
      width="800px"
    >
      <el-form :model="editingContent" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="editingContent.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editingContent.type" placeholder="请选择类型">
            <el-option label="新闻" value="news" />
            <el-option label="通知" value="notice" />
            <el-option label="简介" value="introduction" />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图">
          <el-input v-model="editingContent.coverImage" placeholder="请输入封面图URL" />
        </el-form-item>
        <el-form-item label="摘要">
          <el-input 
            v-model="editingContent.summary" 
            type="textarea" 
            :rows="2"
            placeholder="请输入摘要" 
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input 
            v-model="editingContent.content" 
            type="textarea" 
            :rows="10"
            placeholder="请输入内容" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="success" @click="handleSaveAndPublish">保存并发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContentList, createContent, updateContent, deleteContent, publishContent } from '../../api/content'
import type { Content, ContentQuery } from '../../types/content'
import { ElMessage, ElMessageBox } from 'element-plus'

const contentList = ref<Content[]>([])
const activeType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const showDialog = ref(false)
const editingContent = ref<Partial<Content>>({})

const fetchContents = async () => {
  try {
    const params: ContentQuery = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    if (activeType.value) {
      params.type = activeType.value
    }
    
    const res = await getContentList(params)
    contentList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch contents:', error)
  }
}

const handleFilter = () => {
  currentPage.value = 1
  fetchContents()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchContents()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchContents()
}

const handleAdd = () => {
  editingContent.value = { type: 'news', status: 'draft' }
  showDialog.value = true
}

const handleEdit = (content: Content) => {
  editingContent.value = { ...content }
  showDialog.value = true
}

const handleSave = async () => {
  try {
    if (editingContent.value.id) {
      await updateContent(editingContent.value.id, editingContent.value)
      ElMessage.success('更新成功')
    } else {
      await createContent(editingContent.value)
      ElMessage.success('创建成功')
    }
    showDialog.value = false
    fetchContents()
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleSaveAndPublish = async () => {
  try {
    let contentId = editingContent.value.id
    if (!contentId) {
      const res = await createContent(editingContent.value)
      contentId = res.id
    } else {
      await updateContent(contentId, editingContent.value)
    }
    
    await publishContent(contentId)
    ElMessage.success('发布成功')
    showDialog.value = false
    fetchContents()
  } catch (error: any) {
    ElMessage.error(error.message || '发布失败')
  }
}

const handlePublish = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要发布该内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await publishContent(id)
    ElMessage.success('发布成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '发布失败')
    }
  }
}

const handleArchive = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要归档该内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // TODO: 调用归档API
    ElMessage.success('归档成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '归档失败')
    }
  }
}

const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该内容吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    await deleteContent(id)
    ElMessage.success('删除成功')
    fetchContents()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

const getTypeType = (type: string) => {
  const map: any = {
    news: 'primary',
    notice: 'warning',
    introduction: 'success'
  }
  return map[type] || 'info'
}

const getTypeText = (type: string) => {
  const map: any = {
    news: '新闻',
    notice: '通知',
    introduction: '简介'
  }
  return map[type] || type
}

const getStatusType = (status: string) => {
  const map: any = {
    draft: 'info',
    published: 'success',
    archived: 'warning'
  }
  return map[status] || 'info'
}

const getStatusText = (status: string) => {
  const map: any = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档'
  }
  return map[status] || status
}

onMounted(() => {
  fetchContents()
})
</script>

<style scoped>
.admin-contents {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}

.filter-bar {
  margin-bottom: 20px;
}
</style>
