<template>
  <div class="config-content">
    <a-tabs type="card" @change="changeTabs">
      <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in tabsList">
        <component :is="item.component"></component>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import AuthIndex from './authIndex';
export default {
  name: 'assemblyConfig',
  data() {
    return {
      tabsList: [
        { key: 'auth', tab: '认证', component: 'auth-index' },
        { key: 'validate', tab: '鉴权', component: 'validate' },
        { key: 'flowControl', tab: '流量控制', component: 'flowControl' },
        { key: 'cache', tab: '缓存', component: 'cache' },
        { key: 'route', tab: '路由  ', component: 'route' },
        { key: 'protocol', tab: '协议转换', component: 'protocol' },
        { key: 'dataFit', tab: '数据适配', component: 'dataFit' },
        { key: 'others', tab: '其他', component: 'others' }
      ]
    };
  },
  components: {
    AuthIndex
  },
  methods: {
    changeTabs(item) {
      console.log(item);
    }
  }
};
</script>

<style lang="less" scoped>
// .config-content {
//   // /deep/ .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
//   //   margin-right: 0;
//   //   border-radius: 0;
//   // }
// }
</style>
