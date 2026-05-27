<template>
  <div class="admin-settings">
    <el-row :gutter="20">
      <!-- 基本设置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本设置</span>
            </div>
          </template>
          
          <el-form :model="basicSettings" label-width="100px">
            <el-form-item label="社团名称">
              <el-input v-model="basicSettings.clubName" />
            </el-form-item>
            <el-form-item label="社团简介">
              <el-input 
                v-model="basicSettings.clubDescription" 
                type="textarea" 
                :rows="3"
              />
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicSettings.contactEmail" />
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="basicSettings.contactPhone" />
            </el-form-item>
            <el-form-item label="地址">
              <el-input v-model="basicSettings.address" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 积分规则设置 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>积分规则设置</span>
            </div>
          </template>
          
          <el-form :model="pointsSettings" label-width="120px">
            <el-form-item label="参加活动">
              <el-input-number 
                v-model="pointsSettings.activityPoints" 
                :min="0" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="项目贡献">
              <el-input-number 
                v-model="pointsSettings.projectPoints" 
                :min="0" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="内容创作">
              <el-input-number 
                v-model="pointsSettings.contentPoints" 
                :min="0" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="获奖奖励">
              <el-input-number 
                v-model="pointsSettings.awardPoints" 
                :min="0" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="违规惩罚">
              <el-input-number 
                v-model="pointsSettings.penaltyPoints" 
                :min="0" 
                :max="1000"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSavePoints">保存</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 系统配置 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>系统配置</span>
        </div>
      </template>
      
      <el-form :model="systemSettings" label-width="150px">
        <el-form-item label="允许注册">
          <el-switch v-model="systemSettings.allowRegistration" />
        </el-form-item>
        <el-form-item label="需要审核">
          <el-switch v-model="systemSettings.requireApproval" />
        </el-form-item>
        <el-form-item label="活动报名截止">
          <el-input-number 
            v-model="systemSettings.registrationDeadline" 
            :min="1" 
            :max="30"
            style="width: 200px;"
          />
          <span style="margin-left: 10px;">小时前</span>
        </el-form-item>
        <el-form-item label="每页显示条数">
          <el-input-number 
            v-model="systemSettings.pageSize" 
            :min="10" 
            :max="100"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSaveSystem">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const basicSettings = ref({
  clubName: '开放原子开源社团',
  clubDescription: '电子科技大学成都学院最具活力的技术社团之一',
  contactEmail: 'contact@cduestc-openatom.org',
  contactPhone: '028-12345678',
  address: '电子科技大学成都学院 实验楼 301'
})

const pointsSettings = ref({
  activityPoints: 10,
  projectPoints: 20,
  contentPoints: 5,
  awardPoints: 50,
  penaltyPoints: 10
})

const systemSettings = ref({
  allowRegistration: true,
  requireApproval: true,
  registrationDeadline: 24,
  pageSize: 10
})

const handleSaveBasic = async () => {
  try {
    // TODO: 调用后端API保存基本设置
    ElMessage.success('保存成功')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleSavePoints = async () => {
  try {
    // TODO: 调用后端API保存积分规则
    ElMessage.success('保存成功')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const handleSaveSystem = async () => {
  try {
    // TODO: 调用后端API保存系统配置
    ElMessage.success('保存成功')
  } catch (error: any) {
    ElMessage.error(error.message || '保存失败')
  }
}

const fetchSettings = async () => {
  try {
    // TODO: 调用后端API获取设置
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
}

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.admin-settings {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
</style>