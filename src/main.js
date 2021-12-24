import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器,获取数据权限
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', treeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
