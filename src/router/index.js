import { createRouter, createWebHashHistory } from "vue-router";
import routes, { noMatchRoute } from './constRoutes';
import asyncRoutes from './asyncRoutes';
import { get, remove } from 'js-cookie';
import NProgress from '@/plugins/nprogress';
import { removeStorage, setStorage, getStorage } from '@/utils/storage';
import config from '@/config';
import { getPageTitle } from '@/utils';
import { ganerAuthData } from '@bwrong/auth-tool';
let routerLoaded = false; // 动态路由是否已加载
let removeRouters = [];

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () =>({top: 0, left: 0}),
  routes
});

router.beforeEach(async (to, from, next) => {
  // 进度条
  NProgress.start();
  // 设置页面标题
  document.title = getPageTitle(to.meta.title);
  const token = get(config.tokenKey);
  // 其实路由拦截后所做跳转仅有一下几种情况：
  // 1.已登录时跳转到登录页（非登出的情况）需要重定向到根路径
  if (token && to.path === '/login') {
    return next('/');
  }
  // 2.路由在白名单，或者已经登录且动态路由已加载完成，均放行
  if (config.whiteRoutes.includes(to.path) || (token && routerLoaded)) {
    return next();
  }
  // 3.未登录且不在白名单，重定向到登录页，带上回调地址，方便回归
  if (!token) {
    return next(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
  // 4.根据后台返回权限标识洗出有权限的路由，并将洗过的路由表动态添加到路由中
  // let role =getStorage('userinfo')?.role; // 仅用作模拟，勿在生产环境使用
  // const menus = await authApi.getMenus({
  //   role
  // }).then(res => res);
  // const menus = await authApi.getMenus({}).then(res =>  {
  //   if(res.code === 200) {
  //     setStorage('userinfo', res.body.sysUser);
  //     return res.menus;
  //   }
  // });
  let menus = getStorage('menuList')||[];
  let allowRoutes = _ganerRoutesAndMenus(asyncRoutes, menus);
  // const allowRoutes:any[] = asyncRoutes; // 暂时跳过权限检查
  console.log(noMatchRoute)
  allowRoutes.push(noMatchRoute);
  console.log('allowRoutes: ', allowRoutes);
  // 未加载则动态加载
  removeRouters = allowRoutes.map(router.addRoute);
  //router.addRoutes(allowRoutes);
  routerLoaded = true;
  next({ ...to, replace: true });
});

// 路由后置守卫
router.afterEach(NProgress.done);

// 重置路由
export function resetRouter() {
  removeRouters.map((item) => item());
  routerLoaded = false;
}


/**
 * 生成权限路由和菜单
 * @param {*} routes 需要鉴权的路由
 * @param {*} permissions 菜单和权限标识集
 */
 function _ganerRoutesAndMenus(routes, permissions) {
  const { routes: filterRoutes, menus } = ganerAuthData({
    routes,
    permissions,
    authKey: 'code'
  });
  // setStorage('authMap', authMap);
  setStorage('menus', menus);
  return filterRoutes;
}

// 登出
export function logout() {
  remove(config.tokenKey);
  remove(config.refreshTokenKey);
  remove(config.tokenExpiresKey);
  removeStorage('userinfo', 'menus');
  //router.replace('/login');
  resetRouter();
  location.reload();
}



export default router;
