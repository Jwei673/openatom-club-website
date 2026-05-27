<template>
  <div class="about">
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <h1>关于我们</h1>
        <p>了解开放原子开源社团的故事与愿景</p>
      </div>
    </section>

    <!-- 社团简介 -->
    <section class="intro">
      <div class="container">
        <el-row :gutter="40">
          <el-col :span="12">
            <h2>社团简介</h2>
            <p>开放原子开源社团成立于2020年，是电子科技大学成都学院最具活力的技术社团之一。我们致力于推广开源文化，培养开发者的技术能力，推动校园开源生态的发展。</p>
            <p>社团以"开放、共享、创新、协作"为宗旨，为同学们提供一个学习、交流、实践的平台。在这里，你可以结识志同道合的技术爱好者，参与真实的开源项目，提升自己的技术能力。</p>
            <p>我们与开放原子开源基金会深度合作，引入OpenHarmony、openEuler、OpenTenBase等开源项目，为同学们提供最前沿的技术学习和实践机会。</p>
          </el-col>
          <el-col :span="12">
            <img src="/assets/images/club-cover.png" alt="社团封面" class="intro-image">
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 部门介绍 -->
    <section class="departments">
      <div class="container">
        <h2>部门设置</h2>
        <el-row :gutter="20">
          <el-col :span="8" v-for="dept in departments" :key="dept.id">
            <el-card class="dept-card">
              <div class="dept-icon">
                <img :src="dept.icon" :alt="dept.name">
              </div>
              <h3>{{ dept.name }}</h3>
              <p>{{ dept.description }}</p>
              <p class="dept-leader">负责人：{{ dept.leaderName }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 社团文化 -->
    <section class="culture">
      <div class="container">
        <h2>社团文化</h2>
        <el-row :gutter="20">
          <el-col :span="6" v-for="item in cultureItems" :key="item.title">
            <div class="culture-item">
              <div class="culture-icon">{{ item.icon }}</div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="contact">
      <div class="container">
        <h2>联系我们</h2>
        <el-row :gutter="40">
          <el-col :span="12">
            <div class="contact-info">
              <h3>联系方式</h3>
              <p><strong>地址：</strong>电子科技大学成都学院 实验楼 301</p>
              <p><strong>邮箱：</strong>contact@cduestc-openatom.org</p>
              <p><strong>QQ群：</strong>123456789</p>
              <p><strong>微信公众号：</strong>CDUESTC开放原子开源社团</p>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="contact-qr">
              <img src="/assets/images/qrcode.png" alt="微信公众号二维码" class="qr-code">
              <p>扫描二维码关注我们</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Department } from '../../types/about'

const departments = ref<Department[]>([
  {
    id: 1,
    name: '技术部',
    description: '负责社团技术方向的研究与开发，组织技术分享和培训活动。',
    leaderName: '张三',
    icon: '/assets/images/tech-icon.png'
  },
  {
    id: 2,
    name: '项目部',
    description: '负责社团项目的规划、管理和推进，协调各项目组的合作。',
    leaderName: '李四',
    icon: '/assets/images/project-icon.png'
  },
  {
    id: 3,
    name: '运营部',
    description: '负责社团的日常运营、活动策划、宣传推广和成员管理。',
    leaderName: '王五',
    icon: '/assets/images/operation-icon.png'
  }
])

const cultureItems = ref([
  {
    icon: '🌐',
    title: '开放',
    description: '开放交流，共享知识，欢迎所有人参与'
  },
  {
    icon: '🤝',
    title: '共享',
    description: '分享经验，互助学习，共同成长'
  },
  {
    icon: '💡',
    title: '创新',
    description: '鼓励创新，勇于尝试，突破自我'
  },
  {
    icon: '👥',
    title: '协作',
    description: '团队协作，集思广益，实现共赢'
  }
])
</script>

<style scoped>
.about {
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
  padding: 60px 20px;
}

section h2 {
  text-align: center;
  font-size: 36px;
  margin-bottom: 40px;
}

.intro {
  background: white;
}

.intro p {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  color: #666;
}

.intro-image {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.departments {
  background: #f5f7fa;
}

.dept-card {
  text-align: center;
  transition: transform 0.3s;
  height: 100%;
}

.dept-card:hover {
  transform: translateY(-5px);
}

.dept-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
}

.dept-icon img {
  width: 100%;
  height: 100%;
}

.dept-card h3 {
  font-size: 24px;
  margin-bottom: 15px;
}

.dept-card p {
  color: #666;
  line-height: 1.6;
}

.dept-leader {
  margin-top: 15px;
  color: #667eea;
  font-weight: bold;
}

.culture {
  background: white;
}

.culture-item {
  text-align: center;
  padding: 30px;
}

.culture-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.culture-item h3 {
  font-size: 24px;
  margin-bottom: 15px;
}

.culture-item p {
  color: #666;
  line-height: 1.6;
}

.contact {
  background: #f5f7fa;
}

.contact-info h3, .contact-qr h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.contact-info p {
  font-size: 16px;
  line-height: 2;
  color: #666;
}

.contact-qr {
  text-align: center;
}

.qr-code {
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
}

.contact-qr p {
  color: #666;
}
</style>
