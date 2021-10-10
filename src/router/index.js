import Vue from 'vue'
import VueRouter from 'vue-router'

// import Order from '@/views/Order/Order.vue'
// import Report from '@/views/Report/Report.vue'

const Order = () =>
  import(/* webpackChunkName: "order_report" */ '@/views/Order/Order.vue')

const Report = () =>
  import(/* webpackChunkName: "order_report" */ '@/views/Report/Report.vue')

// import Login from '@/views/Login/Login.vue'
// import Home from '@/views/Home/Home.vue'
// import Welcome from '@/views/Welcome/Welcome.vue'

// import Users from '@/views/Users/Users.vue'
// import Roles from '@/views/Power/Roles.vue'
// import Rights from '@/views/Power/Rights.vue'

// import Cate from '@/views/Goods/Cate.vue'
// import Params from '@/views/Goods/Params.vue'
// import Goods from '@/views/Goods/Goods.vue'
// import AddGoods from '@/views/Goods/AddGoods.vue'

const Cate = () =>
  import(/* webpackChunkName: "goods_params_cate" */ '@/views/Goods/Cate.vue')

const Params = () =>
  import(/* webpackChunkName: "goods_params_cate" */ '@/views/Goods/Params.vue')
const Goods = () =>
  import(/* webpackChunkName: "goods_params_cate" */ '@/views/Goods/Goods.vue')
const AddGoods = () =>
  import(
    /* webpackChunkName: "goods_params_cate" */ '@/views/Goods/AddGoods.vue'
  )

const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/views/Login/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '@/views/Home/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '@/views/Welcome/Welcome.vue'
  )

const Users = () =>
  import(/* webpackChunkName: "users_roles_rights" */ '@/views/Users/Users.vue')
const Roles = () =>
  import(/* webpackChunkName: "users_roles_rights" */ '@/views/Power/Roles.vue')
Vue.use(VueRouter)
const Rights = () =>
  import(
    /* webpackChunkName: "users_roles_rights" */ '@/views/Power/Rights.vue'
  )
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
      { path: '/rights', component: Rights, name: 'rights' },
      { path: '/categories', component: Cate, name: 'cate' },
      { path: '/params', component: Params, name: 'params' },
      { path: '/goods', component: Goods, name: 'goods' },
      { path: '/goods/add', component: AddGoods, name: 'addgoods' },
      { path: '/orders', component: Order, name: 'order' },
      { path: '/reports', component: Report, name: 'report' }
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
