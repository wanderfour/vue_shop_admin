import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/Login.vue'
import Home from '@/views/Home/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, name: 'login' },
  { path: '/home', component: Home, name: 'home' }
]

const router = new VueRouter({
  routes
})

// 导航守卫：全局前置守卫
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  const token = window.sessionStorage.getItem('token')
  if (to.path !== '/login' && !token) next('/login')
  else next()
})

export default router
