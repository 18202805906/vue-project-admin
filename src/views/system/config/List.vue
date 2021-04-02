<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <span class="fr">
        <a-input v-model:value="searchWord" placeholder="请输入系统配置项代码" allowClear class="vertical-top" style="width: 400px">
          <template #addonBefore>
            <a-select :default-value="groups[0].id" style="width: 150px">
              <a-select-option :value="item.id" v-for="item in groups" :key="item.id"> {{ item.value }} </a-select-option>
            </a-select>
          </template>
          
        </a-input>
        <a-button class="space" type="primary">
          <template #icon>
            <search-outlined />
          </template>
          搜索
        </a-button>
        <a-button class="space" type="primary" ghost>
          <template #icon>
            <reload-outlined />
          </template>
          重置
        </a-button>
      </span>
      <a-button class="" type="primary" ghost  @click="handleAdd">
        <template #icon>
            <plus-outlined />
        </template>
        新建 
      </a-button>
    </a-card>
    <a-card style="margin-top: 4px">
      <base-table show-index :columns="columns" :data-source="tableData" :pagination="pagination" :action="action" @change="handlePageChange"></base-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model:visible="showEditModal" :title="isAdd ? '新建' : '编辑'" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => ruleFormRef.resetFields()" >
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
        <a-form-item label="配置项代码" name="code" has-feedback>
          <a-input v-model:value="form.code" :disabled="!isAdd"/>
        </a-form-item>
        <a-form-item label="配置项名称" name="name" has-feedback>
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item label="配置值" name="value" has-feedback>
          <a-input v-model:value="form.value" />
        </a-form-item>
        <a-form-item label="配置类型" name="type" has-feedback>
          <a-select v-model:value="form.type">
            <a-select-option :value="String(item.value)" v-for="item in types" :key="item.value"> {{ item.title }} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="所属分组" name="groupId" has-feedback>
          <a-select v-model:value="form.groupId">
            <a-select-option :value="item.id" v-for="item in groups" :key="item.id"> {{ item.value }} </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="说明" name="discription">
          <a-textarea :rows="4" v-model:value="form.discription" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import BaseTable from '@/components/BasisTable/index';
import { formatTime } from '@/utils';
import configComponent from './components';
import { createVNode, getCurrentInstance, inject, reactive, toRefs,ref } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';

const initForm = {
  code: '',
  name: '',
  value: '',
  type: '',
  groupId: '',
  discription: ''
};
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
        customRender: ({record, text}) => {
          const type = configComponent.find((item) => item.value === Number(record.type));
          return type?.component ? <type.component value={text} is-edit={false} title={text}></type.component> : '';
        }
      },
      { title: '分组', dataIndex: 'groupId', width: 120, align: 'center', customRender: ({text}) => groups.find((item) => item.id === text)?.value },
      {
        title: '说明',
        dataIndex: 'discription',
        ellipsis: true,
        customRender: ({text}) => (
          <a-tooltip>
            <template slots="title">{text}</template>
            <div class="text-nowrap">{text}</div>
          </a-tooltip>
        )
      },
      { title: '修改时间', dataIndex: 'updateTime', width: 170, align: 'center', customRender: ({text}) => formatTime(new Date(text), 'YYYY-MM-DD HH:mm:ss') },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 200 }
    ];
const rules = {
        code: [{ required: true, trigger: 'blur', message: '请输入配置项代码' }],
        name: [{ required: true, trigger: 'blur', message: '请输入配置项名称' }],
        value: [{ required: true, trigger: 'blur', message: '请输入配置项值' }],
        type: [{ required: true, trigger: 'blur', message: '请选择配置类型' }],
        groupId: [{ required: true, trigger: 'blur', message: '请选择所属分组' }]
      }
export default {
  
  components: {
    BaseTable
  },
  setup(){
    const $pagination = inject('$pagination');
    const { proxy } = getCurrentInstance(); 
    let state = reactive({
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
      searchWord: '',
      tableData: [],
      tableLoading: false,
      groups,
      types: configComponent,
      columns: Object.freeze(columns),
      showEditModal: false,
      rules,
      isAdd: true,
      form: {},
      ruleFormRef: ref()
    });
    const tableMethods = {
      getData:(pageNow) => {
        state.tableLoading = true;
        import('./mockData.json').then((res) => {
          state.pagination.current = res.current;
          state.pagination.pageSize = res.size;
          state.pagination.total = res.total;
          state.tableData = res.records;
          state.tableLoading = false;
        });
      },
      handleAdd:() =>{
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
      handleDel:(row)=> {
        proxy.$modal.confirm({
          title: '提示',
          content: <span>您确定要删除【{<span class="text-primary">{row.username}</span>}】用户吗？</span>,
          icon: createVNode(ExclamationCircleOutlined),
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
      handleOk:() =>{
        state.ruleFormRef.validate()
        .then((res)=>{
          state.showEditModal = false;
          proxy.$message.success('操作成功');
        })
      }
    };
    const action = ref([
        {
          text: '编辑',
          click: tableMethods.handleEdit
        },
        {
          text: '删除',
          click: tableMethods.handleDel
        }
    ])
    tableMethods.getData(1);
    return {
      ...toRefs(state),
      ...tableMethods,
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
