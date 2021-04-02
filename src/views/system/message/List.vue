<template>
  <div>
    <a-card>
      <span class="fl">
        <a-button type="primary" ghost style="margin-right: 10px" @click="allRead">
          <template #icon>
            <check-circle-outlined />
          </template>
          全部已读
        </a-button>
        <a-button type="primary" ghost  @click="batchRead">
          <template #icon>
            <check-circle-outlined />
          </template>
          批量已读
        </a-button>
      </span>
      
      <span class="flex" style="justify-content: flex-end;">
        <a-select placeholder="消息类型(可选)" style="width: 15%" v-model:value="form.type">
          <a-select-option v-for="item in types" :key="item.key" :value="item.value">{{ item.value }}</a-select-option>
        </a-select>
        <a-select placeholder="消息状态(可选)" style="width: 15%; margin: 0 10px" v-model:value="form.state">
          <a-select-option value="0">未读</a-select-option>
          <a-select-option value="1">已读</a-select-option>
        </a-select>
        <a-range-picker show-time format="YYYY-MM-DD HH:mm:ss" style="width:28%; margin-right:10px" @change="selectTimes" v-model:value="times"></a-range-picker>
        <div class="r-nw-fe-c" style="float: right">
          <a-button type="primary"  style="margin-right: 10px" @click="search">
            <template #icon>
              <search-outlined />
            </template>
            搜索
          </a-button>
          <a-button type="primary"  style="margin-right: 10px" ghost @click="reset">
            <template #icon>
              <reload-outlined />
            </template>
            重置
          </a-button>
        </div>
      </span>
    </a-card>
    <a-card style="margin-top: 4px">
      <basis-table
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        :columns="columns"
        :dataSource="dataList"
        :pagination="pagination"
        :action="action"
      ></basis-table>
    </a-card>
    <a-modal title="消息详情" :visible="visible" @ok="handleOk" @cancel="handleCancel" :keyboard="false" :maskClosable="false">
      <p>{{ row.content }}</p>
      <template #footer>
        <div class="footer" @click="handleOk">已读</div>
      </template>
    </a-modal>
  </div>
</template>

<script lang="jsx">
import SiteMessage from '@/api/siteMessage';
import BasisTable from '@/components/BasisTable/index.vue';
import { read } from '@/filters/index';
import { getCurrentInstance, inject, reactive, onMounted, toRefs, ref, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

// import { getStorage } from '@/utils/storage';
const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        ellipsis: true
      },
      {
        title: '发送者',
        width: '100px',
        dataIndex: 'sender',
        ellipsis: true
      },
      {
        title: '类型',
        width: '100px',
        dataIndex: 'type',
        ellipsis: true
      },
      {
        title: '内容',
        dataIndex: 'content',
        ellipsis: true
      },
      {
        title: '状态',
        width: '100px',
        dataIndex: 'state',
        ellipsis: true,
        customRender: ({record}) => {
          const status = read(record.state);
          return <a-badge status={status == '未读' ? 'warning' : status == '已读' ? 'processing' : 'warning'} text={status} />;
        }
      },
      {
        title: '发送时间',
        dataIndex: 'createTime',
        ellipsis: true
      },
      {
        title: '操作',
        width: '100px',
        ellipsis: true,
        slots: { customRender: 'action' }
      }
];
export default {
  inject: ['$pagination'],
  components: {
    BasisTable
  },
  setup(){
    const $pagination = inject('$pagination');
    const { proxy } = getCurrentInstance();
    let tableState = reactive({
      columns,
      form: {
        page: 1,
        size: 10,
        asc: false,
        orderBy: 'createTime',
        type: undefined,
        state: undefined,
        startTime: '',
        endTime: ''
      },
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          tableState.form.size = pageSize;
          tableMethods.getData();
        },
        onChange: (val) => {
          tableState.form.page = val;
          tableMethods.getData();
        }
      },
      dataList: [],
      selectedRowKeys: [],
      times: ['', ''],
      types: [],
      visible: false,
      row: {}
    });

    //关于表格的方法
    const tableMethods = {
      // 获取表格数据
      getData: () => {
        SiteMessage.messageList(tableState.form).then((res) => {
          tableState.pagination.total = res.total;
          tableState.dataList = res.records;
        });
      },
      // 获取类型
      getTypes:() => {
        // SiteMessage.typeList().then((res) => {
        //   tableState.types = res;
        // });
        tableState.types = [{id:'1', value: 'WARNING'},{id:'2', value: 'SYSTEM'},{id:'3', value: 'OTHER'}]
      },
      // 查询
      search:() => {
        tableState.form.page = 1;
        tableState.form.size = 10;
        tableMethods.getData();
      },
      // 选择时间
      selectTimes:(data, values) =>{
        tableState.times = data;
        tableState.form.startTime = values[0];
        tableState.form.endTime = values[1];
      },
      // 重置
      reset:()=> {
        tableState.form.type = undefined;
        tableState.form.state = undefined;
        tableState.times = [];
      },
      // 选择表格数据
      onSelectChange:(selectedRowKeys)=> {
        tableState.selectedRowKeys = selectedRowKeys;
      },
      // 全部已读
      allRead:()=> {
        if (tableState.selectedRowKeys.length === 0) {
          proxy.$modal.confirm({
            title: ' 批量标记为已读消息',
            content: '未选中任何未读消息!',
            icon: createVNode(ExclamationCircleOutlined)
          });
        } else {
          proxy.$modal.confirm({
            title: '全部标记为已读消息',
            content: '确定把所有未读消息标记为已读吗?',
             icon: createVNode(ExclamationCircleOutlined),
            okText: '确认',
            cancelText: '取消',
            onOk() {
              // let params = {
              //   messageIds: this.rowKeys,
              //   receiver: getStorage('userinfo').username
              // };
              // console.log('params', params);
              proxy.$message.success('全部已读成功');
              tableState.selectedRowKeys = [];
            }
          });
        }
      },
      // 批量已读
      batchRead:()=> {
        if (tableState.selectedRowKeys.length === 0) {
           proxy.$modal.confirm({
            title: ' 批量标记为已读消息',
            content: '未选中任何未读消息!',
             icon: createVNode(ExclamationCircleOutlined)
          });
        } else {
          proxy.$modal.confirm({
            title: '全部标记为已读消息',
            content: '确定把所有未读消息标记为已读吗?',
             icon: createVNode(ExclamationCircleOutlined),
            okText: '确认',
            cancelText: '取消',
            onOk() {
              // let params = {
              //   messageIds: this.rowKeys,
              //   receiver: getStorage('userinfo').username
              // };
              // console.log('params', params);
              proxy.$message.success('全部已读成功');
              tableState.selectedRowKeys = [];
            }
          });
        }
      },
    };
    const modalMethods = {
      // 详情
      goToDetail:(row)=> {
        tableState.row = { ...row };
        tableState.visible = true;
      },
      
      // 已读
      handleOk:()=> {
        proxy.$message.success('该消息状态变更为已读');
        modalMethods.handleCancel();
      },
      // 取消
      handleCancel:()=> {
        tableState.visible = false;
        tableState.row = {};
      }
    };
    const action= ref([
        {
          text: '详情',
          click: modalMethods.goToDetail
        }
    ]);
    tableMethods.getTypes();
    tableMethods.getData();

    return{
      ...toRefs(tableState),
      ...tableMethods,
      ...modalMethods,
      action
    }
  }
};
</script>

<style lang="scss" scoped>
.footer {
  margin:0 auto;
  width: 100px;
  height: 35px;
  border-radius: 2px;
  line-height: 35px;
  letter-spacing: 4px;
  color:#fff;
  background: #1890ff;
  cursor: pointer;
}
</style>
