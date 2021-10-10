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

// 引入 vue-quill-editor
import vueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 引入加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置访问根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 复习：axios 请求拦截器
axios.interceptors.request.use(config => {
  // 在请求拦截器中，展示进度条
  NProgress.start()
  // 统一在请求头中挂载 token 信息
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 必须return config
  return config
})

axios.interceptors.response.use(config => {
  // 在响应拦截器中，隐藏进度条
  NProgress.done()
  return config
})
// 挂载 axios 到 Vue 实例对象原型上
Vue.prototype.$http = axios

// 将富文本编辑器，注册为全局可用的组件
Vue.use(vueQuillEditor)

// 全局时间过滤器
Vue.filter('dateFormat', date => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
