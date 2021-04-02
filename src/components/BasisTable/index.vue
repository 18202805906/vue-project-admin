<template>
  <div id="basic-table">
    <a-table size="small" :rowKey="rowKey" :columns="computedColumns" v-bind="$attrs" v-on="$listeners">
      <!-- 序号 -->
      <template slot="index" slot-scope="text, record, index">
        {{ index }}
      </template>
      <!-- 操作 -->
      <template slot="action" slot-scope="text, record">
        <template v-if="oneBtn.length">
          <a-button class="button" size="small" v-for="(item, index) in oneBtn" :key="index" :type="item.type ? item.type : 'link'" @click="item.click ? item.click(record) : ''">
            {{ item.text }}
            <a-divider type="vertical" v-if="action.length - 1 != index" />
          </a-button>
        </template>
        <a-dropdown :trigger="['click']" v-if="moreBtn.length">
          <a-button class="button" size="small" v-for="(item, index) in moreBtn" :key="index" :type="item.type ? item.type : 'link'" @click="(e) => e.preventDefault()">{{ item.text }} </a-button>
          <a-menu slot="overlay">
            <a-menu-item v-for="(item, index) in moreBtn[moreBtn.length - 1].children" :key="index" :icon="item.icon" @click="item.click(record)">
              <a-icon :type="item.icon ? item.icon : 'tag'" />
              <span style="margin-left: 5px; padding-right: 5px">{{ item.text }}</span>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </template>
    </a-table>
  </div>
</template>
<script>
import { ganerTableIndex } from '@/utils';
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
  computed: {
    computedColumns() {
      // 判断是否需要显示序号
      if (!this.showIndex) {
        return this.columns;
      } else {
        let { current = 1, pageSize = 10 } = this.$attrs.pagination;
        return [{ title: '序号',width: 80, customRender: (value, row, index) => ganerTableIndex(current, pageSize, index) }, ...this.columns];
      }
    },
    moreBtn() {
      return this.action.filter((ele) => ele.children);
    },
    oneBtn() {
      return this.action.filter((ele) => !ele.children);
    }
  }
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
