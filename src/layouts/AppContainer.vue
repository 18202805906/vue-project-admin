<template>
<a-spin :spinning="globalLoading" tip="应用加载中...">
  <div class="page-wrap">
    <!-- <div id="micro-app-container">微应用加载失败</div> -->
  </div>
</a-spin>
</template>

<script>
import microApp from '@/plugins/microApp';
import {mapState} from 'vuex';
export default {
  computed:{
    ...mapState(['globalLoading'])
  },
  mounted() {
    microApp({sandbox:{ strictStyleIsolation: true }});
  }
};
</script>

<style lang="scss" scoped>
.page-wrap{
  min-height: calc(100vh - 100px);
}
</style>