<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input v-model:value="searchUsername" placeholder="用户名" allowClear class="vertical-top" style="width: 200px" />
        <a-input v-model:value="searchEmail" placeholder="电子邮箱" allowClear class="vertical-top" style="width: 200px; margin-left: 4px" />
        <a-button class="space" type="primary">
          <template #icon>
            <search-outlined />
          </template>
          搜索
        </a-button>
        <a-button class="space" type="primary" ghost @click="reset">
          <template #icon>
            <reload-outlined />
          </template>
          重置
        </a-button>
      </span>
      <a-button class="" type="primary" ghost @click="handleAdd">
        <template #icon>
          <plus-outlined />
        </template>
        新建 
        </a-button>
    </a-card>
    <a-card style="margin-top: 4px">
      <base-table show-index :columns="columns" :data-source="tableData" :pagination="pagination" :action="action"></base-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model:visible="showEditModal" :title="isAdd ? '新建用户' : '编辑用户'" :width="820" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => ruleFormRef.resetFields()">
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item has-feedback label="用户名" name="username">
              <a-input v-model:value="form.username" :disabled="!isAdd">
                <template #suffix>
                   <user-outlined />
                </template>
                <!-- <a-icon type="user" slot="suffix" /> -->
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="姓名" name="name">
              <a-input v-model:value="form.name">
                <template #suffix>
                   <solution-outlined />
                </template>
                <!-- <a-icon type="solution" slot="suffix" /> -->
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="昵称" name="nickName">
              <a-input v-model:value="form.nickName">
                <!-- <a-icon type="number" slot="suffix" /> -->
                <template #suffix>
                   <number-outlined />
                </template>
                </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="身份证号码" name="idNumber">
              <a-input v-model:value="form.idNumber">
                <!-- <a-icon type="idcard" slot="suffix" /> -->
                <template #suffix>
                   <number-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="联系电话" name="telphone">
              <a-input v-model:value="form.telphone">
                <!-- <a-icon type="phone" slot="suffix" /> -->
                <template #suffix>
                   <phone-outlined />
                </template>
               </a-input> </a-form-item
          ></a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="电子邮箱" name="email">
              <a-input v-model:value="form.email">
                <!-- <a-icon type="mail" slot="suffix" />  -->
                <template #suffix>
                   <mail-outlined />
                </template>
              </a-input> </a-form-item
          ></a-col>
          <a-col :span="24">
            <a-form-item has-feedback :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="所属部门" name="deptId">
              <a-cascader
                :options="deptList"
                :defaultValue="[form.deptCode]"
                :fieldNames="{ label: 'label', value: 'code', children: 'children' }"
                v-model:value="form.selectDept"
                placeholder="请选择所属部门"
              ></a-cascader>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="描述" name="remark">
              <a-textarea  :rows="4" v-model:value="form.remark" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <!-- 设置角色 -->
    <a-modal v-model:visible="showRoleModal" title="设置角色" @ok="handleOk" :keyboard="false" :maskClosable="false">
      <a-select v-model:value="selectRole" mode="multiple" placeholder="请选择角色" @change="handleRoleChange" style="width: 100%">
        <a-select-option v-for="item in roleList" :key="item.roleId" :value="item.roleId">
          {{ item.roleName }}
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
//import { pagination } from '@/config';
import BaseTable from '@/components/BasisTable/index';
import { USER_STATUS } from '@/config/dictionary';
import { inject, reactive, ref, getCurrentInstance, toRefs, createVNode } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const initForm = {
  username: '',
  name: '',
  nickName: '',
  email: '',
  idNumber: '',
  deptId: '',
  selectDept: [],
  telphone: '',
  remark: ''
};
const columns = [
  { title: '用户名', dataIndex: 'username',ellipsis: true },
  { title: '姓名', dataIndex: 'name' },
  { title: '昵称', dataIndex: 'nickName' },
  { title: '电子邮箱', dataIndex: 'email',ellipsis: true },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    customRender: ({record}) => {
      if (record.delFlag == '1') {
        return <a-badge status="error" text="已删除" />;
      } else {
        return <a-badge status={record.status == '0' ? 'processing' : 'warning'} text={USER_STATUS[record.status]} />;
      }
    },
    filters: Object.keys(USER_STATUS).map((value) => ({ text: USER_STATUS[value], value })),
    align: 'center'
  },
  { title: '创建时间', dataIndex: 'createTime', width: 200, align: 'center' },
  { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 200 }
];
export default {
  inject: ['$pagination'],
  components: {
    BaseTable
  },
  setup(){
    const $pagination = inject('$pagination');
    const { proxy } = getCurrentInstance();
    let tableState = reactive({
      ruleFormRef: ref(),
      columns: Object.freeze(columns),
      searchUsername: '',
      searchEmail: '',
      tableData: [],
      tableLoading: false,
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }]
      },
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          tableState.form.size = pageSize;
          dataMethods.getData();
        },
        onChange: (val) => {
          tableState.form.page = val;
          dataMethods.getData();
        }
      },
    });
    let modalState = reactive({
      deptList: [],
      showEditModal: false,
      isAdd: true,
      showRoleModal: false,
      roleList: [],
      selectRole: [],
      form: {}
    });
    const dataMethods = {
      getData: (pageNow) =>{
        tableState.tableLoading = true;
        import('./mockData.json').then((res) => {
          tableState.pagination.current = res.current;
          tableState.pagination.pageSize = res.size;
          tableState.pagination.total = res.total;
          tableState.tableData = res.records;
          tableState.tableLoading = false;
        });
      },
      getDeptList:() => {
        import('../department/mockData.json').then((res) => {
          modalState.deptList = res.default;
        });
      },
      getRoleList:() => {
        import('../role/mockData.json').then((res) => {
          modalState.roleList = res.default.records;
        });
      },
      reset:()=>{
        tableState.searchUsername = '';
        tableState.searchEmail = '';
      }
    };
    const modalMethods = {
      handleAdd: () =>{
        modalState.isAdd = true;
        modalState.showEditModal = true;
        modalState.form = {...initForm};
      },
      handleEdit:(row) => {
        modalState.isAdd = false;
        modalState.showEditModal = true;
        modalState.form = { ...row };
      },
      handleLock:(row) => {
        proxy.$modal.confirm({
          title: '提示',
          content:  <span>您确定要锁定【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handleResetPwd: (row) => {
        proxy.$modal.confirm({
          title: '提示',
          content:  <span>您确定要重置【{<span class="text-primary">{row.username}</span>}】用户的密码吗？</span>,
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handleSetRole:(row) => {
        modalState.showRoleModal = true;
      },
      handleDel:(row) => {
        proxy.$modal.confirm({
          title: '提示',
          content:  <span>您确定要删除【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handleOk:() => {},
      handleRoleChange:()=> {}
    };
    const action =  ref([
        {
          text: '编辑',
          click: modalMethods.handleEdit
        },
        {
          text: '删除',
          click: modalMethods.handleDel
        },
        {
          text: '更多',
          //icon: 'down',
          children: [
            {
              text: '锁定账号',
              icon: 'lock',
              click: modalMethods.handleLock
            },
            {
              text: '解锁账号',
              icon: 'unlock',
              click: modalMethods.handleLock
            },
            {
              text: '重置密码',
              icon: 'reload',
              click: modalMethods.handleResetPwd
            },
            {
              text: '设置角色',
              icon: 'user',
              click: modalMethods.handleSetRole
            }
          ]
        }
    ]);
    //初始化数据
    dataMethods.getData(1);
    dataMethods.getDeptList();
    dataMethods.getRoleList();
    return{
      ...toRefs(tableState),
      ...toRefs(modalState),
      ...dataMethods,
      ...modalMethods,
      action
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
