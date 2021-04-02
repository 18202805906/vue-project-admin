<template>
  <div class="page-wrap">
    <a-card class="page-control text-right">
      <a-select placeholder="请选择日志类型" style="width: 100px" allowClear>
        <a-select-option :value="key" v-for="(item,key) in logType" :key="key"> {{item}} </a-select-option>
      </a-select>
      <a-range-picker class="space text-left" allowClear style="width: 280px"/>
      <a-input-search class="space" placeholder="请输入关键字" style="width: 300px" enter-button="搜索" allow-clear></a-input-search>
    </a-card>
    <a-card style="margin-top: 4px">
      <a-table :loading="tableLoading" :columns="columns" show-index :data-source="tableData" size="small" rowKey="id" :pagination="pagination">
        <template #type ="{record}">
          <span>{{logType[record.type]}}</span>
        </template>
        <template #action="{record}">
          <a-space >
            <a-button @click="handleDetail(record)" type="link" size="small">详情</a-button>
          </a-space>
        </template>
        
      </a-table>
    </a-card>
    <a-modal v-model:visible="showDetailModal" title="详情" :width="700" :footer="null" :keyboard="false" :maskClosable="false">
      <a-descriptions bordered size="small" :column="2" layout="vertical" style="width: 100%">
        <a-descriptions-item label="动作"> {{ detail.name }} </a-descriptions-item>
        <a-descriptions-item label="类型">{{ detail.type }} </a-descriptions-item>
        <a-descriptions-item label="用户名"> {{ detail.userName }} </a-descriptions-item>
        <a-descriptions-item label="时间"> {{ detail.createTime }} </a-descriptions-item>
        <a-descriptions-item label="接口地址" :span="2"> {{ detail.path }} </a-descriptions-item>
        <a-descriptions-item label="参数" :span="2">{{ detail.parameters }} </a-descriptions-item>
        <a-descriptions-item label="返回结果" :span="2"> {{ detail.result }} </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
import {LOG_TYPE} from '@/config/dictionary';
import { inject, reactive, toRefs } from 'vue';
import { ganerTableIndex } from '@/utils';
const columns = [
      { title: '类型', dataIndex: 'type', slots: { customRender: 'type' }, width: '150px' },
      { title: '用户名', dataIndex: 'userName',ellipsis: true,width: '100px' },
      { title: '地址', dataIndex: 'path',ellipsis: true },
      { title: '时间', dataIndex: 'createTime',ellipsis: true },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 130 }
    ];

export default {
  setup(props) {
    const $pagination = inject('$pagination');
    const state =reactive({
      logType: LOG_TYPE,
      tableData: [],
      tableLoading: false,
      columns: Object.freeze([
        { title: '序号', customRender: ({index}) => `${ganerTableIndex(state.pagination.current,state.pagination.pageSize,index)}`, width: 50 },
        ...columns
        ]),
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          state.form.size = pageSize;
          tableMethods.getData();
        },
        onChange: (val) => {
          state.form.page = val;
          tableMethods.getData();
        }
      },
      searchValue: '',
      showDetailModal: false,
      detail: {}
    });
    const tableMethods = {
      getData:(pageNow)=> {
        state.tableLoading = true;
        import('./mockData.json').then((res) => {
          state.pagination.current = res.current;
          state.pagination.pageSize = res.size;
          state.pagination.total = res.total;
          state.tableData = res.records;
          state.tableLoading = false;
        });
      },
      handleDetail:(row)=> {
        console.log(row);
        state.detail = row;
        state.showDetailModal = true;
      }
    }
    tableMethods.getData(1);
    return{
      ...toRefs(state),
      ...tableMethods
    }
  }
};
</script>

<style lang="scss" scoped>
.menu-icon {
  width: 400px;
  height: 400px;
  overflow-y: auto;
}
</style>