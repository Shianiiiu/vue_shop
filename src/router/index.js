import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Home.vue'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/home',
    component: Home,
  },
];

const router = new VueRouter({
  routes,
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // next 放行函数
  // next() 直接方姓  next('/login') 强制跳转
  if (to.path === '/login') {
    return next();
  }
  //根据token判断是否已经登录 
  const token = sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  }
  return next();
})

export default router;
