<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input v-model="searchWord" placeholder="请输入系统配置项代码" allowClear class="vertical-top" style="width: 400px">
          <a-select slot="addonBefore" :default-value="groups[0].id" style="width: 150px">
            <a-select-option :value="item.id" v-for="item in groups" :key="item.id"> {{ item.value }} </a-select-option>
          </a-select>
        </a-input>
        <a-button class="space" icon="search" type="primary">搜索</a-button>
        <a-button class="space" icon="reload" type="primary" ghost>重置</a-button>
      </span>
      <a-button class="" type="primary" ghost icon="plus" @click="handleAdd">新建 </a-button>
    </a-card>
    <a-card>
      <base-table show-index :columns="columns" :data-source="tableData" :pagination="pagination" :action="action" @change="handlePageChange"></base-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model="showEditModal" :title="isAdd ? '新建' : '编辑'" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => $refs.ruleForm.resetFields()" >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-model-item label="配置项代码" prop="code" >
          <a-input v-model="form.code" :disabled="!isAdd"/>
        </a-form-model-item>
        <a-form-model-item label="配置项名称" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
        <a-form-model-item label="配置值" prop="value">
          <a-input v-model="form.value" />
        </a-form-model-item>
        <a-form-model-item label="配置类型" prop="type">
          <a-select v-model="form.type">
            <a-select-option :value="String(item.value)" v-for="item in types" :key="item.value"> {{ item.title }} </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="所属分组" prop="groupId">
          <a-select v-model="form.groupId">
            <a-select-option :value="item.id" v-for="item in groups" :key="item.id"> {{ item.value }} </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="说明" prop="discription">
          <a-input type="textarea" :rows="4" v-model="form.discription" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { pagination } from '@/config';
import BaseTable from '@/components/BasisTable/index';
import { formatTime } from '@/utils';
import configComponent from './components';
const initForm = {
  code: '',
  name: '',
  value: '',
  type: '',
  groupId: '',
  discription: ''
};
export default {
  data() {
    const groups = [
      { value: 'ZXCV_QEVAZXF', id: '129' },
      { value: '开关类型分组', id: '135' },
      { value: '路径类型分组', id: '136' },
      { value: '阈值类型分组', id: '137' },
      { value: '分组配置', id: '0' },
      { value: '默认分组', id: '-1' }
    ];
    const columns = [
      { title: '代码', dataIndex: 'code' },
      { title: '名称', dataIndex: 'name' },
      {
        title: '配置值',
        dataIndex: 'value',
        ellipsis: true,
        customRender: (text, row) => {
          const type = configComponent.find((item) => item.value === Number(row.type));
          return type?.component ? <type.component value={text} is-edit={false} title={text}></type.component> : '';
        }
      },
      { title: '分组', dataIndex: 'groupId', width: 120, align: 'center', customRender: (text) => groups.find((item) => item.id === text)?.value },
      {
        title: '说明',
        dataIndex: 'discription',
        ellipsis: true,
        customRender: (text) => (
          <a-tooltip>
            <template slot="title">{text}</template>
            <div class="text-nowrap">{text}</div>
          </a-tooltip>
        )
      },
      { title: '修改时间', dataIndex: 'updateTime', width: 170, align: 'center', customRender: (text) => formatTime(new Date(text), 'YYYY-MM-DD HH:mm:ss') },
      { title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', width: 200 }
    ];
    return {
      searchWord: '',
      tableData: [],
      tableLoading: false,
      groups,
      types: configComponent,
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
        }
      ],
      showEditModal: false,
      isAdd: true,
      form: {},
      rules: {
        code: [{ required: true, trigger: 'blur', message: '请输入配置项代码' }],
        name: [{ required: true, trigger: 'blur', message: '请输入配置项名称' }],
        value: [{ required: true, trigger: 'blur', message: '请输入配置项值' }],
        type: [{ required: true, trigger: 'blur', message: '请选择配置类型' }],
        groupId: [{ required: true, trigger: 'blur', message: '请选择所属分组' }]
      }
    };
  },
  components: {
    BaseTable
  },
  created() {
    this.getData(1);
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
    handleOk() {}
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
