import Layout from '@/layouts/VerticalLayout.vue';
// 组件管理
export default [
  {
    path: '/componentManager',
    redirect: '/componentManager/basis',
    component: Layout,
    meta: {
      permission: 'plugin'
    },
    children: [
      // 基础组件
      {
        path: '/componentManager/basis',
        component: () => import('@/views/component-manager/basis/List.vue'),
        meta: {
          permission: 'pluginManager'
        }
      },
      {
        path: '/componentManager/basis/add',
        component: () => import('@/views/component-manager/basis/Add.vue'),
        meta: {
          // permission: 'pluginManagerAdd'
        }
      },
      // 共享组件配置
      {
        path: '/componentManager/share',
        component: () => import('@/views/component-manager/share/List.vue'),
        meta: {
          permission: 'sharedComponent'
        }
      }
    ]
  }
];
