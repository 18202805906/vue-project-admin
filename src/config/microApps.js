import { message } from 'ant-design-vue';
export default [
  {
    name: 'spider',
    entry: '//10.18.101.210:8081/',
    activeRule: (location) => location.pathname.startsWith('/app'), // 激活子应用的路由，需要在路由中添加一次对应的路由
    container: '#micro-app-container', // 子应用挂载的容器
    props: {
      // 要传递给子应用的数据
      routerBase: '/app', // 下发路由给子应用，子应用根据该值去定义qiankun环境下的路由
      message
    }
  }
];
