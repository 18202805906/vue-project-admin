<template>
  <div id="basic-table">
    <a-table size="small" :rowKey="rowKey" :columns="computedColumns" v-bind="$attrs">
      <!-- 序号 -->
      <template #index="{index}">
        {{ index }}
      </template>
      
      <!-- 操作 -->
      <template #action="{record}">
          <template v-if="oneBtn.length">
            <a-button class="button" size="small" v-for="(item, index) in oneBtn" :key="index" :type="item.type ? item.type : 'link'" @click="item.click ? item.click(record) : ''">
              {{ item.text }}
              <a-divider type="vertical" v-if="action.length - 1 != index" />
            </a-button>
          </template>
          <a-dropdown :trigger="['click']" v-if="moreBtn.length">
            <a-button class="button" size="small" v-for="(item, index) in moreBtn" :key="index" :type="item.type ? item.type : 'link'" @click.prevent>{{ item.text }} </a-button>
            <template #overlay>
              <a-menu >
                  <a-menu-item v-for="(item, index) in moreBtn[moreBtn.length - 1].children" :key="index" @click="item.click(record)">
                    <template #icon>
                      <component :is="item.icon"></component>
                    </template>
                    <!-- <a-icon :type="item.icon ? item.icon : 'tag'" /> -->
                    <component :is="item.icon ? item.icon : 'tag-outlined'"></component>
                    <span style="margin-left: 5px; padding-right: 5px">{{ item.text }}</span>
                  </a-menu-item>
                
              </a-menu>
            </template>
          </a-dropdown>
      </template>
    </a-table>
  </div>
</template>
<script>
import { ganerTableIndex } from '@/utils';
import { computed } from 'vue';
export default {
  props: {
    action: {
      type: Array,
      default: () => {}
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      required: true
    }
  },

  setup(props, { attrs }){
    let computedColumns = computed( () =>{
      // 判断是否需要显示序号
      if (!props.showIndex) {
        return props.columns;
      } else {
        let { current = 1, pageSize = 10 } = attrs.pagination;
        return [{ title: '序号',width: 80, customRender: ({index}) => ganerTableIndex(current, pageSize, index) }, ...props.columns];
      }
    });
    let moreBtn = computed( () =>{
      return props.action.filter((ele) => ele.children);
    });
    let oneBtn = computed( () =>{
      return props.action.filter((ele) => !ele.children);
    });
    return{
      computedColumns,
      moreBtn,
      oneBtn
    }
  },
};
</script>

<style lang="less" scoped>
#basic-table {
  .ant-btn-sm {
    padding: 0;
  }
  .ant-divider,
  .ant-divider-vertical {
    width: 2px;
    background: #5ea4ff;
  }
}
</style>
