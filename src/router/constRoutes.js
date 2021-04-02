
//静态路由
const routes = [
    {
      path: "/login",
      name: "login",
      component: () => import('@/views/login/Index.vue')
    },
    {
      path: '/',
      redirect: '/home',
      component: () => import('@/layouts/VerticalLayout.vue'),
      // children: [
      //   {
      //     path: '/app',
      //     name: 'app',
      //     component: () => import('@/layouts/AppContainer.vue')
      //   }
      // ]
    },
    {
      path: '/err',
      name: 'err',
      component: () => import('@/views/err/Index.vue')
    },
  ];


  export default routes;

  //未匹配到的路由
  // export const noMatchRoute = { //vue3.0该写法会报错
  //     path: '*',
  //     redirect: '/err'
  // }
  // 未匹配到路由时显示的页面
  export const noMatchRoute = {
    path: '/:catchAll(.*)',
    name: 'notFound',
    redirect: '/err'
  };