<template>
  <a-modal :visible="show" title="授权" @cancel="handleCancel" @ok="handleOk" :keyboard="false" :maskClosable="false">
    <div class="auth-menu-wrap">
      <a-tree v-model:value="checkedKeys" checkable :tree-data="menus" :default-checked-keys="value" :replaceFields="{ children: 'children', title: 'name', key: 'id' }" />
    </div>
  </a-modal>
</template>

<script>
import { getStorage } from '@/utils/storage';
import { convertToTree } from '@/utils';
import { reactive, toRefs } from 'vue';
const menu = getStorage('menus');
const menuTree = convertToTree({data:menu, pid:-1});
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  setup(props, {emit}){
    const state =reactive({
      menus: menuTree,
      checkedKeys: []
    });
    const methods = {
      handleCancel:()=> {
        emit('update:show', false);
      },
      handleOk:()=> {
        emit('input', state.checkedKeys);
        methods.handleCancel();
      }
    };
    return{
      ...toRefs(state),
      ...methods
    }
  }
};
</script>

<style lang="scss" scoped>
.auth-menu-wrap {
  max-height: 500px;
  overflow-y: auto;
}
</style>