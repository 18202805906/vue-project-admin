import Vue from 'vue';
import router from './router';
import store from './store';
import '@/plugins';
import '@/assets/style/index.scss';
import App from './App.vue';
import * as filters from '@/filters';
Vue.config.productionTip = false;

// 注册过滤器
Object.keys(filters).map((key) => Vue.filter(key, filters[key]));
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
