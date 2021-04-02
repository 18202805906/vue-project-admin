import { registerMicroApps, start, addGlobalUncaughtErrorHandler } from 'qiankun';
import microApps from '@/config/microApps';
import store from '@/store';
// 注册微应用
registerMicroApps(microApps, {
  beforeLoad: (app) => {
    console.log('开始加载应用>>>', app.name);
    store.commit('setGlobalLoading', true);
  },
  beforeMount: [
    (app) => {
      console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
    }
  ],
  afterMount: [
    (app) => {
      console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
      store.commit('setGlobalLoading', false);
    }
  ],
  afterUnmount: [
    (app) => {
      console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
    }
  ]
});
/**
 * 添加全局的未捕获异常处理器
 */
addGlobalUncaughtErrorHandler((event) => {
  console.error(event);
  const { message } = event;
  // 加载失败时提示
  if (message && message.includes('died in status LOADING_SOURCE_CODE')) {
    console.error('微应用加载失败，请检查应用是否可运行');
  }
});
export default start;
