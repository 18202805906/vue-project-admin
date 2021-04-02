<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <!-- <a-input v-model="searchValue" placeholder="请输入部门名称..." allowClear class="vertical-top" style="width: 200px" />
      <a-button class="space" icon="search">搜索</a-button>
      <a-button class="space" icon="reload">重置</a-button> -->
      <a-button type="primary" ghost @click="handleAdd">
        <template #icon>
          <plus-outlined />
        </template>
        新建 
      </a-button>
      <a-button class="space" type="primary" ghost>
        <template #icon>
          <medicine-box-outlined />
        </template>
        数据修复 
      </a-button>
      <a-input-search class="fr" placeholder="请输入部门名称" style="width: 350px" enter-button="搜索" allow-clear @search="handleSearch"></a-input-search>
    </a-card>
    <a-card style="margin-top: 4px">
      <a-table show-index :columns="columns" :data-source="tableData" size="small" rowKey="id" :expandIconColumnIndex="1" :pagination="pagination" @change="handlePageChange">
        <template #action="{record}">
          <div>
            <a-button @click="handleEdit(record)" type="link" size="small" :style="{padding: '0'}">编辑</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleDel(record)" type="link" size="small" :style="{padding: '0'}">删除</a-button>
          </div>
        </template>
        
      </a-table>
    </a-card>
    <!-- 新增和编辑 -->
    <a-modal v-model:visible="showEditModal" :title="isAdd ? '新建' : '编辑'" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => ruleFormRef.resetFields()">
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-form-item has-feedback label="部门名称" name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item has-feedback label="部门编码" name="code">
          <a-input v-model:value="form.code" />
        </a-form-item>
        <a-form-item has-feedback label="部门主管" name="createUser">
          <a-select v-model:value="form.createUser">
            <a-select-option :value="item.id" v-for="item in userList" :key="item.id">{{item.username}} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item has-feedback label="描述" name="deptDesc">
          <a-textarea :rows="4" v-model:value="form.deptDesc"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="jsx">
import { ganerTableIndex } from '@/utils';
import { getCurrentInstance, inject, reactive, createVNode, toRefs, ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const initForm = {
  name: '',
  code: '',
  createUser: '',
  deptDesc:''
};
const columns = [
      { title: '部门名称', dataIndex: 'name', ellipsis: true},
      { title: '部门编码', dataIndex: 'code' },
      { title: '部门主管', dataIndex: 'createUser' },
      { title: '部门描述', dataIndex: 'deptDesc',ellipsis: true },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 300 }
    ];
export default {

  setup(props) {
    const $pagination = inject('$pagination');
    const { proxy } = getCurrentInstance();
    let state = reactive({
      ruleFormRef: ref(),
      tableData: [],
      tableLoading: false,
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          modalState.form.size = pageSize;
          dataMethods.getData();
        },
        onChange: (val) => {
          modalState.form.page = val;
          dataMethods.getData();
        }
      },
      columns: Object.freeze([
        { title: '序号', customRender: ({index}) => `${ganerTableIndex(state.pagination.current, state.pagination.pageSize, index)}`, width: 50 },
        ...columns
      ]),
      searchValue: '',
      rules: {
        name: [{ required: true, trigger: 'change', message: '请输入部门名称' }],
        code: [{ required: true, trigger: 'change', message: '请输入部门编码' }]
      },
    });
    let modalState = reactive({
      deptList: [],
      selectDept: [],
      showEditModal: false,
      isAdd: true,
      form: {},
      showAuthModal: false,
      selectAuth: [],
      userList: []
    });
    const dataMethods = {
      getData:(pageNow)=>{
        state.tableLoading = true;
        import('./mockData.json').then((res) => {
          // this.pagination.current = res.current;
          // this.pagination.pageSize = res.size;
          // this.pagination.total = res.total;
          state.tableData = res.default;
          state.tableLoading = false;
        });
      },
      getUserList:()=> {
        import('../user/mockData.json').then((res) => {
          modalState.userList = res.default.records;
        });
      },
    };
    const modalMethods ={
      handleAdd:()=> {
        modalState.isAdd = true;
        modalState.showEditModal = true;
        modalState.form = { ...initForm };
      },
      handleEdit:(row)=> {
        console.log(row);
        modalState.isAdd = false;
        modalState.showEditModal = true;
        modalState.form = { ...row };
      },
      handleAuth:(row)=> {
        console.log(row);
        modalState.showAuthModal = true;
      },
      handleDel:(row)=> {
        proxy.$modal.confirm({
          title: '提示',
          content: <span>您确定要删除【{<span class="text-primary">{row.name}</span>}】吗？</span>,
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handleSearch:(key)=> {
        console.log(key);
      },
      handleOk:() =>{
        state.ruleFormRef.validate()
        .then((res)=>{
          proxy.$message.success('操作成功');
          modalState.showEditModal = false;
        })
      }
    }
    dataMethods.getData(1);
    dataMethods.getUserList();
    return {
      ...toRefs(state),
      ...toRefs(modalState),
      ...modalMethods
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