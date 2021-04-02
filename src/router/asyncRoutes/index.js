import system from './system';
import serviceRegister from './serviceRegister';
import componentManager from './componentManager';
import Layout from '@/layouts/VerticalLayout.vue';
// 注意：为了方便和后台返回菜单合并，提取url，path需要填写完整
const routes = [
  {
    path: '/',
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/Index.vue'),
        meta: {
          title: '首页'
          // permission: 'home'
        }
      }
    ]
  },
  ...system,
  ...serviceRegister,
  ...componentManager
];
export default routes;
