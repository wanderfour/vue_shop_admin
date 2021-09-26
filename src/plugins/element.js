import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

// 将 Message 挂载到 Vue原型对象，如此每个组件都可以通过 this.$message 访问
Vue.prototype.$message = Message
