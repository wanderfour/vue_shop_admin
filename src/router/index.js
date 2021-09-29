import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login/Login.vue'
import Home from '@/views/Home/Home.vue'
import Welcome from '@/views/Welcome/Welcome.vue'
import Users from '@/views/Users/Users.vue'
import Roles from '@/views/Power/Roles.vue'
import Rights from '@/views/Power/Rights.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login, name: 'login' },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome, name: 'welcome' },
      { path: '/users', component: Users, name: 'users' },
      { path: '/roles', component: Roles, name: 'roles' },
      { path: '/rights', component: Rights, name: 'rights' }
    ]
  }
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
