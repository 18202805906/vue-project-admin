<template>
  <a-card class="config-content">
    <a-tabs type="card" @change="changeTabs">
      <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in tabsList">
        <component :is="item.component"></component>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script>
import AuthIndex from './components/authIndex.vue';
export default {
  name: 'assemblyConfig',
  components: {
    AuthIndex
  },
  setup(){
    const tabsList = [
        { key: 'auth', tab: '认证', component: 'auth-index' },
        { key: 'validate', tab: '鉴权', component: 'validate' },
        { key: 'flowControl', tab: '流量控制', component: 'flowControl' },
        { key: 'cache', tab: '缓存', component: 'cache' },
        { key: 'route', tab: '路由  ', component: 'route' },
        { key: 'protocol', tab: '协议转换', component: 'protocol' },
        { key: 'dataFit', tab: '数据适配', component: 'dataFit' },
        { key: 'others', tab: '其他', component: 'others' }
      ];
    const changeTabs = (item)=> {
      console.log(item);
    };
    return {
      tabsList,
      changeTabs
    }

  }
};
</script>
