<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <a-button type="primary" ghost @click="handleAdd">
        <template #icon>
          <plus-outlined />
        </template>
        新建 
      </a-button>
      <a-input-search class="fr" placeholder="请输入关键字" style="width: 300px" enter-button="搜索" allow-clear></a-input-search>
    </a-card>
    <a-card style="margin-top: 4px">
      <a-table :columns="columns" :data-source="tableData"   size="small" row-key="roleId" :pagination="pagination" @change="handlePageChange">
        <template #action="{record}">
          <div>
            <a-button @click="handleEdit(record)" type="link" size="small" :style="{padding: '0'}">编辑</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleAuth(record)" type="link"  size="small" :style="{padding: '0'}">授权</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleDel(record)" type="link"  size="small" :style="{padding: '0'}">删除</a-button>
          </div>
        </template>
        
      </a-table>
    </a-card>
    <!-- 新增和编辑 -->
    <a-modal v-model:visible="showEditModal" :title="isAdd ? '新建' : '编辑'" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => ruleFormRef.resetFields()">
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{span: 18}">
        <a-form-item has-feedback label="角色名称" name="roleName">
          <a-input v-model:value="form.roleName" />
        </a-form-item>
        <a-form-item has-feedback label="角色编码" name="roleCode">
          <a-input v-model:value="form.roleCode" />
        </a-form-item>
        <a-form-item has-feedback label="所属部门" name="selectDept">
          <a-cascader :options="deptList" :default-value="[form.deptCode]" :field-names="{ label: 'label', value: 'code', children: 'children' }" v-model:value="selectDept" placeholder="请选择所属部门"></a-cascader>
        </a-form-item>
        <a-form-item has-feedback label="角色描述" name="roleDesc">
          <a-textarea :rows="3" v-model:value="form.roleDesc" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- 授权  -->
    <auth-menu-modal :show="showAuthModal" v-model="selectAuth"></auth-menu-modal>
  </div>
</template>

<script>
import AuthMenuModal from './components/AuthMenuModal.vue';
import {ganerTableIndex} from '@/utils';
import { getCurrentInstance, reactive, ref, toRefs, inject } from 'vue';

const initForm = {
  roleName: '',
  roleCode: '',
  deptName: '',
  deptId: 0,
  deptCode: 0,
  roleDesc: ''
};
const columns = [
      { title: '名称', dataIndex: 'roleName',ellipsis: true },
      { title: '编码', dataIndex: 'roleCode',ellipsis: true },
      { title: '部门', dataIndex: 'deptName' },
      { title: '描述', dataIndex: 'roleDesc',ellipsis: true },
      { title: '创建时间', dataIndex: 'createTime',  width: 200 },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 300 }
    ];
const rules = {
        roleName: [{ required: true, trigger: 'blur', message: '请输入角色名称' }],
        roleCode: [{ required: true, trigger: 'blur', message: '请输入角色编码' }],
        deptId: [{ required: true, trigger: 'blur', message: '请选择所属部门' }]
      };
export default {
  components: { AuthMenuModal },
  setup(){
    const $pagination = inject('$pagination');
    const {proxy} = getCurrentInstance();
    let state = reactive({
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          state.form.size = pageSize;
          dataMethods.getData();
        },
        onChange: (val) => {
          state.form.page = val;
          dataMethods.getData();
        }
      },
      tableData: [],
      tableLoading: false,
      columns: Object.freeze([
        { title: '序号', customRender: ({index}) => ganerTableIndex(state.pagination.current,state.pagination.pageSize,index), width:50 },
        ...columns
      ]),
      searchValue: '',
      deptList:[],
      selectDept:[],
      showEditModal: false,
      isAdd: true,
      form: {},
      showAuthModal: false,
      selectAuth: [],
      ruleFormRef: ref(),
      rules
    });

    const dataMethods ={
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
      getDeptList:()=>{
        import('../department/mockData.json').then((res) => {
          state.deptList = res.default;
        });
      },
    };
    const tableMethods = {
      handleAdd:()=> {
        state.isAdd = true;
        state.showEditModal = true;
        state.form = { ...initForm };
      },
      handleEdit:(row)=> {
        console.log(row);
        state.isAdd = false;
        state.showEditModal = true;
        state.form = { ...row };
      },
      handleAuth:(row)=> {
        console.log(row);
        state.showAuthModal=true;
      },
      handleDel:(row)=> {
        proxy.$modal.confirm({
          title: '提示',
          content: <span>您确定要删除【{<span class="text-primary">{row.roleName}</span>}】吗？</span>,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handlePageChange:(pagination, filters, sorter)=> {
        state.pagination = pagination;
        console.log(pagination, filters, sorter);
      },
      handleOk:()=> {
        state.ruleFormRef.validate()
        .then((res) =>{
          state.showEditModal = false;
          proxy.$message.success('操作成功');
        })
      }
    };
    dataMethods.getData(1);
    dataMethods.getDeptList();
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