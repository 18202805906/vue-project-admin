<template>
  <div>
    <a-card class="page-control">
      <a-button type="primary" ghost  @click="changAdd">
        <template #icon  >
          <plus-outlined />
        </template>
        新建
      </a-button>
      <span class="fr text-right">
        <a-input placeholder="请输入分组名称" style="width: 200px" type="primary" v-model:value="params.name" />
        <a-input placeholder="请输入分组编码" style="width: 200px; margin: 0 10px" type="primary" v-model:value="params.code" />
        <a-select placeholder="请选择状态" style="width: 90px" v-model:value="params.state">
          <a-select-option value="0"> 未分组 </a-select-option>
          <a-select-option value="1"> 已分组</a-select-option>
        </a-select>
        <a-space style="margin-left: 20px">
          <a-button type="primary" @click="search">
            <template #icon  >
              <search-outlined />
            </template>
            搜索
          </a-button>
          <a-button type="primary" ghost @click="reset">
            <template #icon  >
              <reload-outlined />
            </template>
            重置
          </a-button>
        </a-space>
      </span>
    </a-card>
    <a-card style="margin-top: 4px">
      <basis-table :columns="columns" :pagination="pagination" :dataSource="dataList" :action="action"></basis-table>
    </a-card>
    <a-modal :title="title" :keyboard="false" :maskClosable="false" v-model:visible="visible" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel" :afterClose="() =>ruleFormRef.resetFields()">
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-form-item has-feedback label="分组名称" name="name">
          <a-input :disabled="disabled" v-model:value="form.name" placeholder="请输入分组名称" />
        </a-form-item>
        <a-form-item has-feedback label="分组编码" name="code">
          <a-input :disabled="disabled" v-model:value="form.code" placeholder="请输入分组编码" />
        </a-form-item>
        <a-form-item has-feedback label="分组状态" name="state">
          <a-select :disabled="disabled" placeholder="请选择状态" v-model:value="form.state">
            <a-select-option value="0"> 未分组 </a-select-option>
            <a-select-option value="1"> 已分组 </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import BasisTable from '@/components/BasisTable';
import { groupState } from '@/filters/index';
import { reactive, toRefs, ref, inject, getCurrentInstance, createVNode  } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
const columnsArr = [
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
    customRender: (text) => groupState(text.record.state)
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
    slots: { customRender: 'action' }
  }
];
export default {
  components: {
    BasisTable
  },
  setup(){
    const { proxy } = getCurrentInstance();
    const $pagination = inject('$pagination');
    const rulesObj = {  
          name: [{ required: true, trigger: 'change', message: '请输入分组名称' }],
          code: [{ required: true, trigger: 'change', message: '请输入分组编码'}]
        };
    let columns = ref([
        // {
        //   title: '序号',
        //   customRender: (text) => `${(pagination.current - 1) * 10 + text.index + 1}`,
        //   align: 'center',
        //   width: '5%'
        // },
        ...columnsArr
      ]);
    
      
      let pagination = reactive({
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          params.pageSize = pageSize;
          searchMethods.getData();
        },
        onChange: (val) => {
          params.current = val;
          searchMethods.getData(params.current);
        }
      });
      console.log('pagination: ', pagination);
      let params = reactive({
          name: '',
          code: '',
          state: undefined,
          current: 1,
          pageSize: 10
      });
      let form = reactive({
          name: '',
          code: '',
          state: '0',
          id: ''
      });
      const state = reactive({
          dataList: [],
          title: '新建分组',
          visible: false,
          confirmLoading: false,
          disabled: false,
          ruleFormRef : ref(),
          rules: rulesObj
      });
      // 获取数据
      const searchMethods = {
        // 搜索
        search: () => {
          params.current = 1;
          searchMethods.getData();
        },
        // 重置
        reset: () => {
          params.name = '';
          params.code = '';
          params.state = undefined;
        },
        //获取数据
        getData: (current = 1) => {
          import('./mockData').then((res) => {
            pagination.current = current;
            pagination.pageSize = res.size;
            pagination.total = res.total;
            state.dataList = res.recode;
          });
        }
      };
      const tableMethods = {
        // 管理
        changeManager: function(row){
          console.log('guanli', row);
        },
        // 编辑
        changeEdit: (row) => {
          state.visible = true;
          state.title = '修改' + row.name;
          Object.assign(form, {...row});
          state.disabled = false;
        },
        // 查看
        changeSearch:(row) => {
          state.visible = true;
          state.title = row.name;
          Object.assign(form, {...row});
          state.disabled = true;
        },
        // 删除
        changeDel: (row) => {
          proxy.$modal.confirm({
            title: '提示',
            content: <span>您确定要删除【{<span class="text-primary">{row.name}</span>}】吗？</span>,
            icon: createVNode(ExclamationCircleOutlined),
            okText: '确认',
            cancelText: '取消',
            onOk() {
              console.log('row', row);
              proxy.$message.success('删除成功');
              state.visible = false;
              searchMethods.getData();
            }
          });
        }
      };
      const modalMethods = {
        // 新建
        changAdd: () => {
          state.visible = true;
          state.disabled = false;
        },
        // 确认
        handleOk: () => {
          state.ruleFormRef.validate()
          .then(res => {
            if (form.id && !state.disabled) {
              proxy.$message.success('修改成功');
              modalMethods.handleCancel();
              searchMethods.getData();
            } else if (!form.id) {
              proxy.$message.success('保存成功');
              modalMethods.handleCancel();
              searchMethods.getData();
            } else {
              modalMethods.handleCancel();
            }
          })
          
        },
        // 取消
        handleCancel:() => {
          state.visible = false;
          setTimeout(() => {
            form.value = {};
          }, 1000);
        }
      };
      let action = ref([
        {
          text: '管理',
          click: tableMethods.changeManager
        },
        {
          text: '删除',
          click: tableMethods.changeDel
        },

        {
          text: '更多',
          children: [
            {
              text: '编辑',
              icon: 'edit',
              click: tableMethods.changeEdit
            },
            {
              text: '查看',
              icon: 'search',
              click: tableMethods.changeSearch
            }
          ]
        }
      ]);
      searchMethods.getData();
      return{
        columns,
        action,
        pagination,
        params,
        form,
        ...toRefs(state),
        ...searchMethods,
        tableMethods,
        ...modalMethods
      }
  }
};
</script>

<style></style>
