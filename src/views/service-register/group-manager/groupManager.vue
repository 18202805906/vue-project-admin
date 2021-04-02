<template>
  <div>
    <a-card class="page-control">
      <a-button type="primary" ghost icon="plus" @click="changAdd">新建</a-button>
      <span class="fr text-right">
        <a-input placeholder="请输入分组名称" style="width: 200px" type="primary" v-model="params.name" />
        <a-input placeholder="请输入分组编码" style="width: 200px; margin: 0 10px" type="primary" v-model="params.code" />
        <a-select placeholder="请选择状态" style="width: 100px" v-model="params.state">
          <a-select-option value="0"> 未读 </a-select-option>
          <a-select-option value="1"> 已读 </a-select-option>
        </a-select>
        <a-space style="margin-left: 20px">
          <a-button type="primary" icon="search" @click="search">搜索</a-button>
          <a-button type="primary" ghost @click="reset">重置</a-button>
        </a-space>
      </span>
    </a-card>
    <a-card style="margin-top: 4px">
      <basis-table :columns="columns" :pagination="pagination" :dataSource="dataList" :action="action"></basis-table>
    </a-card>
    <a-modal :title="title" :keyboard="false" :maskClosable="false" :visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="() => $refs.ruleForm.resetFields()">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-form-model-item has-feedback label="分组名称" prop="name">
          <a-input :disabled="disabled" v-model="form.name" placeholder="请输入分组名称" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="分组编码" prop="code">
          <a-input :disabled="disabled" v-model="form.code" placeholder="请输入分组编码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="分组状态" prop="state">
          <a-select :disabled="disabled" placeholder="请选择状态" v-model="form.state">
            <a-select-option value="0"> 未读 </a-select-option>
            <a-select-option value="1"> 已读 </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import BasisTable from '@/components/BasisTable';
import { pagination } from '@/config';
import { apiStae } from '@/filters/index';
const columns = [
  {
    title: '分组名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '分组编码',
    dataIndex: 'code',
  },
  {
    title: '分组状态',
    width: '200px',
    dataIndex: 'status',
    customRender: (text, record) => apiStae(record.status)
  },
  {
    title: '更新时间',
    dataIndex: 'update',
    ellipsis: true
  },
  {
    title: '操作',
    width: '280px',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
];
const rules = {
  name: [{ required: true, trigger: 'change' }],
  code: [{ required: true, trigger: 'change' }]
};
export default {
  data() {
    return {
      columns,
      action: [
        {
          text: '管理',
          click: this.changeManager
        },
        {
          text: '删除',
          click: this.changeDel
        },

        {
          text: '更多',
          children: [
            {
              text: '编辑',
              icon: 'edit',
              click: this.changeEdit
            },
            {
              text: '查看',
              icon: 'search',
              click: this.changeSearch
            }
          ]
        }
      ],
      pagination: {
        ...pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          this.form.pageSize = pageSize;
          this.getData();
        },
        onChange: (val) => {
          this.params.current = val;
          this.getData();
        }
      },
      params: {
        name: '',
        code: '',
        state: undefined,
        current: 1,
        pageSize: 10
      },
      dataList: [],
      title: '新建分组',
      visible: false,
      confirmLoading: false,
      rules,
      form: {
        name: '',
        code: '',
        state: '0'
      },
      disabled: false
    };
  },
  components: {
    BasisTable
  },
  created() {
    this.getData(1);
  },
  methods: {
    // 获取数据
    getData() {
      import('./mockData').then((res) => {
        this.pagination.current = res.current;
        this.pagination.pageSize = res.size;
        this.pagination.total = res.total;
        this.dataList = res.recode;
      });
    },
    // 搜索
    search() {
      this.params.current = 1;
      this.getData();
    },
    // 重置
    reset() {
      this.params = {};
    },
    // 新建
    changAdd() {
      this.visible = true;
      this.disabled = false;
    },
    // 管理
    changeManager(row) {
      console.log('guanli', row);
    },
    // 编辑
    changeEdit(row) {
      this.visible = true;
      this.title = row.name;
      this.form = { ...row };
      this.disabled = false;
    },
    // 查看
    changeSearch(row) {
      this.visible = true;
      this.title = row.name;
      this.form = { ...row };
      this.disabled = true;
    },
    // 删除
    changeDel(row) {
      const that = this;
      this.$modal.confirm({
        title: '提示',
        content: <span>您确定要删除【{<span class="text-primary">{row.name}</span>}】吗？</span>,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          console.log('row', row);
          that.$message.success('删除成功');
          that.visible = false;
          that.getData(1);
        }
      });
    },
    // 确认
    handleOk() {
      if (this.form.id && !this.disabled) {
        this.$message.success('修改成功');
        this.handleCancel();
        this.getData(1);
      } else if (!this.form.id) {
        this.$message.success('保存成功');
        this.handleCancel();
        this.getData(1);
      } else {
        this.handleCancel();
      }
    },
    // 取消
    handleCancel() {
      this.visible = false;
      setTimeout(() => {
        this.form = {};
      }, 1000);
    }
  }
};
</script>

<style></style>
