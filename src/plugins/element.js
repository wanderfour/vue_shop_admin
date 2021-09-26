import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

// 将 Message 挂载到 Vue原型对象，如此每个组件都可以通过 this.$message 访问
Vue.prototype.$message = Message
