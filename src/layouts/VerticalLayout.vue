<template>
  <a-layout class="layout">
    <l-header  :collapse="collapse" :bread-crumb="parentMenus" class="layout-header__fixed">
      <template #logo>
        <l-logo style="margin: 0 20px 0 0"></l-logo>
      </template>
    </l-header>
    <a-layout class="layout-main" style="padding-top: 64px">
      <a-layout-sider :theme="theme" v-model:collapsible="collapse" :trigger="null" collapsible breakpoint="lg">
        <l-sider :menus="menus" :theme="theme" :collapse="collapse" :open-keys="openeds" :selected-keys="curtMenuKey"></l-sider>
      </a-layout-sider>
      <a-layout-content class="app-scroll-wrap">
        <l-bread-crumb :data="parentMenus" />
        <div class="app-main" id="micro-app-container">
          <transition mode="out-in" name="fade-transform">
            <router-view></router-view>
          </transition>
        </div>
      </a-layout-content>
      <!-- <l-footer></l-footer> -->
    </a-layout>
  </a-layout>
</template>
<script>
import LayoutMinxin from '@/mixins/layout.mixin';
import { defineComponent } from 'vue';
  export default defineComponent ({
  name: 'vertical-layout',
  mixins: [LayoutMinxin()]
});
</script>
<style lang="scss" scoped>
@import url('../assets/style/layout.less');
.app-scroll-wrap {
  height: calc(100vh - 64px);
  overflow-y: auto;
}
.app-main {
  overflow-y: auto;
  padding: 16px;
  //margin: 20px;
  border-radius: 5px;
  //background: #fff;
}
.layout-main {
  &:deep(.ant-layout-sider){
    background-color: none;
  }
}
</style>
