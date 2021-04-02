<template>
  <div class="page-wrap">
    <a-card class="page-control">
      <a-space>
        <a-button type="primary"  ghost @click="handleAdd">
          <template #icon><plus-outlined /></template>
          新建
         </a-button>
      </a-space>
    </a-card>
    <a-card style="margin-top: 4px">
      <a-table :columns="columns" :data-source="tableData" size="small" rowKey="id" :pagination="pagination" @change="handlePageChange">
        <template #type="{record}">
          <a-tag  :color="record.type == '0' ? '' : 'orange'">{{ record.type == '0' ? '菜单' : '按钮' }}</a-tag>
        </template>
        <template #icon="{text}">
          <component :is="text"></component>
        </template>
        <!-- <a-icon slot="icon" slot-scope="icon" :type="icon" /> -->
        <template  #action="{record}">
          <div>
            <a-button @click="handleEdit(record)" type="link" size="small" :style="{padding: '0'}">编辑</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleAddChild(record)" type="link" size="small" :style="{padding: '0'}">添加子项</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleHide(record, true)" type="link" v-if="!record.hide" size="small" :style="{padding: '0'}">隐藏</a-button>
            <a-button @click="handleHide(record, false)" type="link" v-else size="small" :style="{padding: '0'}">显示</a-button>
            <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
            <a-button @click="handleDel(record)" type="link" size="small" :style="{padding: '0'}">删除</a-button>
          </div>
        </template>
      </a-table>
    </a-card>
    <!-- 新增编辑 -->
    <a-modal v-model:visible="showEditModal" :title="isAdd ? '新建' : '编辑'" :keyboard="false" :maskClosable="false" @ok="handleOk" :afterClose="() => ruleFormRef.resetFields()">
      <a-form ref="ruleFormRef" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-form-item has-feedback label="类型" name="type">
          <a-radio-group v-model:value="form.type">
            <a-radio :value="key" v-for="(item, key) in menuType" :key="key">
              {{ item }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item has-feedback label="父级目录" name="parentId">
          <a-input v-model:value="form.parentId" />
        </a-form-item>
        <a-form-item has-feedback :label="`${menuType[form.type]}名称`" name="name">
          <a-input v-model:value="form.name" />
        </a-form-item>
        <a-form-item has-feedback label="权限标识" name="code">
          <a-input v-model:value="form.code" />
        </a-form-item>
        <a-form-item has-feedback label="图标" name="icon" v-if="form.type === '0'">
          <a-input v-model:value="form.icon" readonly>
            <template #addonAfter>
            <a-popover placement="right" :autoAdjustOverflow="false" title="选择图标" >
              <template #content>
                <div class="menu-icon" >
                  <icon-picker v-model:value="form.icon" />
                </div>
              </template>
              <component :is="form.icon + '-outlined'" v-if="form.icon"></component>
              <span v-else>选择</span>
            </a-popover>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item has-feedback label="序号" name="priority" v-if="form.type === '0'">
          <a-input-number v-model:value="form.priority" class="width-full" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="jsx">
import { getStorage } from '@/utils/storage';
import { convertToTree } from '@/utils';
import { MENU_TYPE } from '@/config/dictionary';
import { getCurrentInstance, reactive, toRefs,  ref, inject } from 'vue';
import IconPicker from '@/components/IconPicker/index.vue';
const initForm = {
  name: '',
  parentId: 0,
  code: '',
  icon: '',
  type: '0',
  priority: 0
};
const columns = [
      { title: '菜单名字', dataIndex: 'name',ellipsis: true },
      { title: '权限标识', dataIndex: 'code',ellipsis: true },
      { title: '图标', dataIndex: 'icon', slots: { customRender: 'icon' } },
      { title: '类型', dataIndex: 'type', slots: { customRender: 'type' } },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 360 }
    ];
const menu = getStorage('menus');
const menuTree = convertToTree({ data: menu, pid: -1 });
const rules = {
        name: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
        code: [{ required: true, trigger: 'blur', message: '请输入菜单权限标识' }]
      }
export default {
  components: {
    IconPicker
  },
  setup(){
    const $pagination = inject('$pagination');
    const {proxy} = getCurrentInstance();
    let state = reactive({
      tableData: menuTree,
      tableLoading: false,
      columns: Object.freeze(columns),
      pagination: {
        ...$pagination,
        pageSize: 20
      },
      showEditModal: false,
      isAdd: true,
      menuType: MENU_TYPE,
      form: {},
      rules,
      ruleFormRef: ref()
    });

    const tableMethods = {
      handleAdd:()=> {
        state.isAdd = true;
        state.showEditModal = true;
        state.form = { ...initForm };
      },
      handleAddChild:(row)=> {
        state.isAdd = true;
        state.showEditModal = true;
        state.form = { ...initForm, parentId: row.id };
      },
      handleEdit:(row)=> {
        console.log(row);
        state.isAdd = false;
        state.showEditModal = true;
        state.form = { ...row };
      },
      handleHide:(row, status)=> {
        console.log(row, status);
        row.hide = status;
        proxy.$message.success('操作成功');
      },
      handleDel:(row)=> {
        proxy.$modal.confirm({
          title: '提示',
          content: <span>您确定要删除【{<span class="text-primary">{row.name}</span>}】吗？</span>,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            proxy.$message.success('操作成功');
          }
        });
      },
      handlePageChange:(pagination, filters, sorter) =>{
        state.pagination = pagination;
        console.log(pagination, filters, sorter);
      },
      handleOk:()=>{
        state.showEditModal = false;
        proxy.$message.success('操作成功');
      }
    };
    return {
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