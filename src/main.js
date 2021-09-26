import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import './plugins/element.js'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// 导入全局样式表
import '@/assets/css/global.css'

// 引入时间处理第三方包 dayjs
import dayjs from 'dayjs'

// 引入 axios
import axios from 'axios'
// 配置访问根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 复习：axios 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须returnconfig
  return config
})
// 挂载 axios 到 Vue 实例对象原型上
Vue.prototype.$http = axios

// 全局时间过滤器
Vue.filter('dateFormat', date => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
