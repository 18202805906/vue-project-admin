<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input v-model="searchUsername" placeholder="用户名" allowClear class="vertical-top" style="width: 200px" />
        <a-input v-model="searchEmail" placeholder="电子邮箱" allowClear class="vertical-top" style="width: 200px; margin-left: 4px" />
        <a-button class="space" icon="search" type="primary">搜索</a-button>
        <a-button class="space" icon="reload" type="primary" ghost>重置</a-button>
      </span>
      <a-button class="" type="primary" ghost icon="plus" @click="handleAdd">新建 </a-button>
    </a-card>
    <a-card>
      <base-table show-index :columns="columns" :data-source="tableData" :pagination="pagination" :action="action" @change="handlePageChange"></base-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model="showEditModal" :title="isAdd ? '新建' : '编辑'" :width="820" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => $refs.ruleForm.resetFields()">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-model-item has-feedback label="用户名" prop="username">
              <a-input v-model="form.username" :disabled="!isAdd">
                <a-icon type="user" slot="suffix" />
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="姓名" prop="name">
              <a-input v-model="form.name"><a-icon type="solution" slot="suffix" /></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="昵称" prop="nickName">
              <a-input v-model="form.nickName"><a-icon type="number" slot="suffix" /></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item has-feedback label="身份证号码" prop="idNumber">
              <a-input v-model="form.idNumber"><a-icon type="idcard" slot="suffix" /></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="联系电话" prop="telphone">
              <a-input v-model="form.telphone"><a-icon type="phone" slot="suffix" /> </a-input> </a-form-model-item
          ></a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="电子邮箱" prop="email">
              <a-input v-model="form.email"><a-icon type="mail" slot="suffix" /> </a-input> </a-form-model-item
          ></a-col>
          <a-col :span="24">
            <a-form-model-item has-feedback :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="所属部门" prop="deptId">
              <a-cascader
                :options="deptList"
                :defaultValue="[form.deptCode]"
                :fieldNames="{ label: 'label', value: 'code', children: 'children' }"
                v-model="selectDept"
                placeholder="请选择所属部门"
              ></a-cascader>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item has-feedback :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" label="描述" prop="remark">
              <a-input type="textarea" :rows="4" v-model="form.remark" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-modal>
    <!-- 设置角色 -->
    <a-modal v-model="showRoleModal" title="设置角色" @ok="handleOk" :keyboard="false" :maskClosable="false">
      <a-select v-model="selectRole" mode="multiple" placeholder="请选择角色" @change="handleRoleChange" style="width: 100%">
        <a-select-option v-for="item in roleList" :key="item.roleId" :value="item.roleId">
          {{ item.roleName }}
        </a-select-option>
      </a-select>
    </a-modal>
  </div>
</template>

<script>
import { pagination } from '@/config';
import BaseTable from '@/components/BasisTable/index';
import { USER_STATUS } from '@/config/dictionary';
const initForm = {
  username: '',
  name: '',
  nickName: '',
  email: '',
  idNumber: '',
  deptId: '',
  telphone: '',
  remark: ''
};
export default {
  data() {
    const columns = [
      { title: '用户名', dataIndex: 'username',ellipsis: true },
      { title: '姓名', dataIndex: 'name' },
      { title: '昵称', dataIndex: 'nickName' },
      { title: '电子邮箱', dataIndex: 'email',ellipsis: true },
      {
        title: '状态',
        dataIndex: 'status',
        width: 100,
        customRender: (text, record) => {
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
      { title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', width: 200 }
    ];
    return {
      searchUsername: '',
      searchEmail: '',
      tableData: [],
      tableLoading: false,
      columns: Object.freeze(columns),
      pagination: {
        ...pagination,
        pageSize: 20
      },
      action: [
        {
          text: '编辑',
          click: this.handleEdit
        },
        {
          text: '删除',
          click: this.handleDel
        },
        {
          text: '更多',
          //icon: 'down',
          children: [
            {
              text: '锁定账号',
              icon: 'lock',
              click: this.handleLock
            },
            {
              text: '解锁账号',
              icon: 'unlock',
              click: this.handleLock
            },
            {
              text: '重置密码',
              icon: 'reload',
              click: this.handleResetPwd
            },
            {
              text: '设置角色',
              icon: 'user',
              click: this.handleSetRole
            }
          ]
        }
      ],
      deptList: [],
      selectDept: [],
      showEditModal: false,
      isAdd: true,
      form: {},
      rules: {
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }],
        name: [{ required: true, trigger: 'blur', message: '请输入姓名' }]
      },
      showRoleModal: false,
      roleList: [],
      selectRole: []
    };
  },
  components: {
    BaseTable
  },
  created() {
    this.getData(1);
    this.getDeptList();
    this.getRoleList();
  },
  methods: {
    getData(pageNow) {
      this.tableLoading = true;
      import('./mockData.json').then((res) => {
        this.pagination.current = res.current;
        this.pagination.pageSize = res.size;
        this.pagination.total = res.total;
        this.tableData = res.records;
        this.tableLoading = false;
      });
    },
    getDeptList() {
      import('../department/mockData.json').then((res) => {
        this.deptList = res.default;
      });
    },
    getRoleList() {
      import('../role/mockData.json').then((res) => {
        this.roleList = res.default.records;
      });
    },
    handleAdd() {
      this.isAdd = true;
      this.showEditModal = true;
      this.form = { ...initForm };
    },
    handleEdit(row) {
      console.log(row);
      this.isAdd = false;
      this.showEditModal = true;
      this.form = { ...row };
    },
    handleLock(row) {
      this.$modal.confirm({
        title: '提示',
        content: () => <span>您确定要锁定【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('操作成功');
        }
      });
    },
    handleResetPwd(row) {
      this.$modal.confirm({
        title: '提示',
        content: () => <span>您确定要重置【{<span class="text-primary">{row.username}</span>}】用户的密码吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('操作成功');
        }
      });
    },
    handleSetRole(row) {
      this.showRoleModal = true;
    },
    handleDel(row) {
      this.$modal.confirm({
        title: '提示',
        content: () => <span>您确定要删除【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          this.$message.success('操作成功');
        }
      });
    },
    handlePageChange(pagination, filters, sorter) {
      this.pagination = pagination;
      console.log(pagination, filters, sorter);
    },
    handleOk() {},
    handleRoleChange() {}
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
