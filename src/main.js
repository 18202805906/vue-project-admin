import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.less"; // or 'ant-design-vue/dist/antd.less'
import '@/assets/style/index.less';
import plugins from '@/plugins';
import * as filters from '@/filters';
import * as Icons from "@ant-design/icons-vue";
import config from '@/config';



const icons = Icons;
const app = createApp(App);

// 注册过滤器
//Object.keys(filters).map((key) => app.filter(key, filters[key]));
app.use(router);
app.use(store);
app.use(plugins); // 注册插件
app.provide('$pagination', config.pagination); // 注入分页配置
app.mount('#app');
for (const i in icons) {
    app.component(i, icons[i]);
}
export default app;
