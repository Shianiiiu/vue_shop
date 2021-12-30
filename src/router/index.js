import Vue from 'vue';
import VueRouter from 'vue-router';
const Login = () => import(/* webpackChunkName: "login_home_welome" */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: "login_home_welome" */ '../components/Home.vue')
const Welcome = () => import(/* webpackChunkName: "login_home_welome" */ '../components/Welcome.vue')
// import Login from '../components/Login.vue';
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'

const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Rights.vue')
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/rights/Roles.vue')
// import Users from '../components/user/Users.vue'
// import Rights from '../components/rights/Rights.vue'
// import Roles from '../components/rights/Roles.vue'

const Cate = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
const Params = () => import(/* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'

const List = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/components/Add.vue')
// import List from '../components/goods/List.vue'
// import Add from '../components/goods/components/Add.vue'

const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/Order.vue')
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

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
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report },
    ]
  },
];

const router = new VueRouter({
  routes,
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // next 放行函数
  // next() 直接放行  next('/login') 强制跳转
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
