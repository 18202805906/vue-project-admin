import Layout from '@/layouts/VerticalLayout.vue';
const routes = [
  {
    path: '/serviceRegister',
    name: 'serviceRegister',
    redirect: '/serviceRegister/serviceApi',
    component: Layout,
    meta: {
      permission: 'apiRegister'
    },
    children: [
      {
        path: '/serviceRegister/serviceApi',
        name: 'serviceApi',
        component: () => import('@/views/service-register/service-api/serviceApi.vue'),
        meta: {
          permission: 'serviceApi'
        }
      },
      {
        path: '/serviceRegister/groupManager',
        name: 'groupManager',
        component: () => import('@/views/service-register/group-manager/groupManager.vue'),
        meta: {
          permission: 'groupManager'
        }
      }
    ]
  }
];
export default routes;
