<template>
  <div class="member-points">
    <el-row :gutter="20">
      <!-- 积分概览 -->
      <el-col :span="8">
        <el-card class="points-overview">
          <div class="points-number">{{ totalPoints }}</div>
          <div class="points-label">当前积分</div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>积分规则</span>
            </div>
          </template>
          <el-table :data="pointsRules" style="width: 100%">
            <el-table-column prop="action" label="行为" />
            <el-table-column prop="points" label="积分" width="100" />
            <el-table-column prop="description" label="说明" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 积分记录 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>积分记录</span>
        </div>
      </template>
      
      <el-table :data="pointsList" style="width: 100%">
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag :type="getTypeType(scope.row.type)">
              {{ getTypeText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createdAt" label="时间" width="180" />
      </el-table>
      
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getPointsRecordList, getUserPoints } from '../../api/points'
import type { PointsRecord } from '../../types/points'

const totalPoints = ref(0)
const pointsList = ref<PointsRecord[]>([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const pointsRules = ref([
  { action: '参加活动', points: '+10~50', description: '根据活动时长和工作量决定' },
  { action: '项目贡献', points: '+20~100', description: '根据贡献度决定' },
  { action: '内容创作', points: '+5~30', description: '发布新闻、教程等' },
  { action: '获奖奖励', points: '+50~200', description: '比赛获奖、优秀项目等' },
  { action: '违规行为', points: '-10~50', description: '缺席活动、违反纪律等' }
])

const fetchPoints = async () => {
  try {
    const userId = parseInt(localStorage.getItem('userId') || '0')
    const res = await getUserPoints(userId)
    totalPoints.value = res
  } catch (error) {
    console.error('Failed to fetch user points:', error)
  }
}

const fetchPointsRecords = async () => {
  try {
    const params: any = {
      page: currentPage.value,
      size: pageSize.value
    }
    
    const userId = parseInt(localStorage.getItem('userId') || '0')
    if (userId) {
      params.userId = userId
    }
    
    const res = await getPointsRecordList(params)
    pointsList.value = res.records
    total.value = res.total
  } catch (error) {
    console.error('Failed to fetch points records:', error)
  }
}

const getTypeType = (type: string) => {
  const map: any = {
    activity: 'primary',
    project: 'success',
    contribution: 'warning',
    reward: 'danger',
    penalty: 'info'
  }
  return map[type] || 'info'
}

const getTypeText = (type: string) => {
  const map: any = {
    activity: '活动',
    project: '项目',
    contribution: '贡献',
    reward: '奖励',
    penalty: '惩罚'
  }
  return map[type] || type
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchPointsRecords()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchPointsRecords()
}

onMounted(() => {
  fetchPoints()
  fetchPointsRecords()
})
</script>

<style scoped>
.member-points {
  padding: 20px;
}

.points-overview {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.points-number {
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 10px;
}

.points-label {
  font-size: 18px;
  opacity: 0.9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>
