<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>
<script>
import { ref, defineComponent } from 'vue';
import zh from 'ant-design-vue/es/locale/zh_CN';

export default defineComponent({
  setup() {
    const locale = ref(zh);
    return {
      locale
    };
  }
});
</script>
