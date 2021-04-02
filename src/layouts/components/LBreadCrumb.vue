<template>
  <a-breadcrumb separator=">" class="breadcrumb" >
    <a-breadcrumb-item>
      <HomeOutlined type="home" class="home-ico" theme="filled" />
      <router-link to="/">首页</router-link></a-breadcrumb-item
    >
    <a-breadcrumb-item v-for="item in data" :key="item.id"
      ><router-link :to="item.url">{{ item.title }}</router-link></a-breadcrumb-item
    >
  </a-breadcrumb>
</template>
<script>

import { HomeOutlined } from '@ant-design/icons-vue';
export default {
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components:{
    HomeOutlined
  }
};
</script>
<style lang="scss" scoped>
.breadcrumb {
  padding: 0 10px;
  background-color: #fff;
  line-height: 48px;
  .home-ico{
    color: #D1E9FF;
    margin-right: 8px;
  }
}
</style>