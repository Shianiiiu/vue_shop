import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//请求拦截器,获取数据权限
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start();
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  console.log(config);
  NProgress.done();
  return config
})

Vue.prototype.$http = axios

Vue.component('tree-table', treeTable)
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal * 1000);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
