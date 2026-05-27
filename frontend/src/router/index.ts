import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/HomeView.vue'
import AboutView from '../views/about/AboutView.vue'
import NewsView from '../views/news/NewsView.vue'
import NewsDetailView from '../views/news/NewsDetailView.vue'
import ActivitiesView from '../views/activities/ActivitiesView.vue'
import ActivityDetailView from '../views/activities/ActivityDetailView.vue'
import ProjectsView from '../views/projects/ProjectsView.vue'
import ProjectDetailView from '../views/projects/ProjectDetailView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import MemberLayout from '../views/member/MemberLayout.vue'
import MemberProfile from '../views/member/MemberProfile.vue'
import MemberPoints from '../views/member/MemberPoints.vue'
import MemberActivities from '../views/member/MemberActivities.vue'
import MemberProjects from '../views/member/MemberProjects.vue'
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import AdminUsers from '../views/admin/AdminUsers.vue'
import AdminDepartments from '../views/admin/AdminDepartments.vue'
import AdminContents from '../views/admin/AdminContents.vue'
import AdminActivities from '../views/admin/AdminActivities.vue'
import AdminProjects from '../views/admin/AdminProjects.vue'
import AdminApprovals from '../views/admin/AdminApprovals.vue'
import AdminPoints from '../views/admin/AdminPoints.vue'
import AdminSettings from '../views/admin/AdminSettings.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/news',
      name: 'news',
      component: NewsView
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: NewsDetailView
    },
    {
      path: '/activities',
      name: 'activities',
      component: ActivitiesView
    },
    {
      path: '/activities/:id',
      name: 'activity-detail',
      component: ActivityDetailView
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      component: ProjectDetailView
    },
    {
      path: '/auth/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/auth/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/member',
      component: MemberLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'member',
          component: MemberProfile
        },
        {
          path: 'points',
          name: 'member-points',
          component: MemberPoints
        },
        {
          path: 'activities',
          name: 'member-activities',
          component: MemberActivities
        },
        {
          path: 'projects',
          name: 'member-projects',
          component: MemberProjects
        }
      ]
    },
    {
      path: '/admin',
      component: AdminLayout,
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin',
          component: AdminDashboard
        },
        {
          path: 'users',
          name: 'admin-users',
          component: AdminUsers
        },
        {
          path: 'departments',
          name: 'admin-departments',
          component: AdminDepartments
        },
        {
          path: 'contents',
          name: 'admin-contents',
          component: AdminContents
        },
        {
          path: 'activities',
          name: 'admin-activities',
          component: AdminActivities
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: AdminProjects
        },
        {
          path: 'approvals',
          name: 'admin-approvals',
          component: AdminApprovals
        },
        {
          path: 'points',
          name: 'admin-points',
          component: AdminPoints
        },
        {
          path: 'settings',
          name: 'admin-settings',
          component: AdminSettings
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('userRole')
  
  if (to.meta.requiresAuth && !token) {
    next('/auth/login')
  } else if (to.meta.requiresAdmin && userRole !== 'admin' && userRole !== 'president') {
    next('/member')
  } else {
    next()
  }
})

export default router
