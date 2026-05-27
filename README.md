# 电子科技大学成都学院开放原子开源社团官网系统

版本：v0.1  
项目类型：社团官网 + 内容社区 + 后台管理系统  
技术栈：Vue 3 + Spring Boot 3 + PostgreSQL

## 项目介绍

本项目为电子科技大学成都学院开放原子开源社团正式官网系统。

正式官网不应只是一个静态展示页，而应作为社团长期使用的线上平台，承担以下职责：

- **对外**：展示社团形象、新闻动态、活动信息、项目成果、知识内容、加入方式
- **对内**：支持成员登录、发帖交流、活动报名、项目参与、积分记录
- **对管理者**：支持内容审核、用户管理、部门管理、权限管理、活动管理、项目管理、系统配置和操作日志

## 技术栈

### 前端
- Vue 3 + TypeScript + Vite
- Vue Router + Pinia + Axios
- Element Plus

### 后端
- Spring Boot 3 + Spring Security + JWT
- MyBatis-Plus + Spring Validation
- PostgreSQL（后续兼容 OpenTenBase）

### 部署
- 云服务器 + Nginx + Spring Boot Jar + PostgreSQL + systemd

## 目录结构

```
openatom-club-website/
├── frontend/          # Vue 3 前端项目
├── backend/           # Spring Boot 后端项目
├── docs/             # 项目文档
└── README.md         # 项目说明
```

## 快速开始

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

### 后端启动

```bash
cd backend
mvn clean package
java -jar target/openatom-backend.jar
```

## 文档

- [功能需求文档](docs/功能需求文档.md)
- [技术栈文档](docs/技术栈文档.md)
- [页面设计文档](docs/页面设计文档.md)
- [数据库表结构文档](docs/数据库表结构文档.md)
- [权限设计文档](docs/权限设计文档.md)
- [接口文档](docs/接口文档.md)
- [部署文档](docs/部署文档.md)

## 开发进度

- [x] 项目初始化
- [ ] 前端基础框架搭建
- [ ] 后端基础框架搭建
- [ ] 数据库设计
- [ ] 用户认证模块
- [ ] 权限管理模块
- [ ] 内容管理模块
- [ ] 活动管理模块
- [ ] 项目管理模块
- [ ] 后台管理模块

## 贡献指南

欢迎社团成员参与项目开发。请阅读 [贡献指南](docs/贡献指南.md) 了解详细信息。

## 许可证

MIT License

---

**开发状态**：项目初始化中  
**维护者**：开放原子开源社团技术部  
**更新时间**：2026-05-27