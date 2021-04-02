import Layout from '@/layouts/VerticalLayout.vue';
// 系统管理
export default [
  {
    path: '/system',
    name: 'system',
    redirect: '/system/department',
    component: Layout,
    meta: {
      permission: 'systemManager'
    },
    children: [
      //部门管理
      {
        path: '/system/department',
        name: 'department',
        component: () => import('@/views/system/department/List.vue'),
        meta: {
          permission: 'sectionManager'
        }
      },
      {
        path: '/system/department/add',
        name: 'departmentAdd',
        component: () => import('@/views/system/department/Edit.vue'),
        meta: {
          // permission: 'department'
        }
      },
      {
        path: '/system/department/edit/:id',
        name: 'departmentEdit',
        component: () => import('@/views/system/department/Edit.vue'),
        meta: {
          // permission: 'department'
        }
      },
      // 站内消息
      {
        path: '/system/message',
        name: 'message',
        component: () => import('@/views/system/message/List.vue'),
        meta: {
          permission: 'message'
        }
      },
      // 系统配置
      {
        path: '/system/config',
        name: 'config',
        component: () => import('@/views/system/config/List.vue'),
        meta: {
          permission: 'sysSetting'
        }
      },
      // 用户日志
      {
        path: '/system/log',
        name: 'log',
        component: () => import('@/views/system/log/List.vue'),
        meta: {
          permission: 'userLog'
        }
      },
      // 角色管理
      {
        path: '/system/role',
        name: 'role',
        component: () => import('@/views/system/role/List.vue'),
        meta: {
          permission: 'roleManager'
        }
      },
      // 菜单管理
      {
        path: '/system/menu',
        name: 'menu',
        component: () => import('@/views/system/menu/List.vue'),
        meta: {
          permission: 'resourceManager'
        }
      },
      // 用户管理
      {
        path: '/system/user',
        name: 'user',
        component: () => import('@/views/system/user/List.vue'),
        meta: {
          permission: 'userManager'
        }
      }
    ]
  }
];
