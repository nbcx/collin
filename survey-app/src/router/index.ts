import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/create',
    name: 'CreateSurvey',
    component: () => import('../views/CreateSurvey.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/survey/:id',
    name: 'TakeSurvey',
    component: () => import('../views/TakeSurvey.vue')
  },
  {
    path: '/survey/:id/results',
    name: 'SurveyResults',
    component: () => import('../views/SurveyResults.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-surveys',
    name: 'MySurveys',
    component: () => import('../views/MySurveys.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const user = localStorage.getItem('user')
  
  if (requiresAuth && !user) {
    next('/login')
  } else {
    next()
  }
})

export default router
