<template>
  <a-modal title="回收站" :visible="trashVisible" :footer="null" width="50%" center :keyboard="false" :maskClosable="false" @cancel="cancelFrom">
    <!-- <template slot="closeIcon">
      <img :src="closeSrc" />
    </template> -->
    <a-card :hoverable="true" :bordered="false">
      <a-row>
        <a-col :span="24">
          <!-- 搜索框 -->
          <a-card :hoverable="true">
            <a-input-search class="fr" placeholder="请输入接口名称..." enter-button="搜索" allow-clear v-model.trim="searchPage.name" style="width: 48%">
            </a-input-search>
            <!-- <a-button type="primary" icon="search" @click="searchTrashList" style="margin-left: 10px">搜索</a-button> -->
            <!-- <a-button type="primary" ghost @click="reset" style="margin-left: 10px">重置</a-button> -->
          </a-card>
        </a-col>
      </a-row>
      <a-row style="margin-top: 4px">
        <a-col :span="24">
          <base-table :columns="columns" :dataSource="trashList" :action="action" :pagination="pagination" :loading="loading"> </base-table>
        </a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>

<script lang="jsx">
import BaseTable from '@/components/BasisTable/index.vue';
import serviceBaseApi from '@/api/serviceApiBase';
import { Modal } from 'ant-design-vue';
import { getCurrentInstance, inject, reactive, toRefs, ref } from 'vue';
const columns = [
  {
    title: '接口名称',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'apiTypeName',
    ellipsis: true
  },
  {
    title: '版本',
    dataIndex: 'version',
    ellipsis: true
  },
  {
    title: '操作',
    width: '30%',
    ellipsis: true,
    align: 'center',
    key: 'action',
    dataIndex: 'action',
    slots: { customRender: 'action' }
  }
];
export default {
  name: 'serviceApiTrash',
  props: {
    trashVisible: {
      type: Boolean
    }
  },
  components: {
    BaseTable
  },
  setup(props, {emit}){
    const { proxy } = getCurrentInstance();
    const $pagination = inject('$pagination');
    const state = reactive({
      //closeSrc: require('@/assets/images/modal/modal-close.png'),
      searchPage: {
        orderByFiled: 'update_time',
        isAsc: false,
        name: ''
      },
      loading: false,
      trashList: [],
      columns: Object.freeze(columns),
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        showQuickJumper: false,
        onChange: (val) => {
          state.pagination.current = val;
          this.getTrashList();
        }
      },
    });
    const dataMethods = {
       //构建参数回收对象
      getParams:()=> {
        let {
          orderByFiled,
          isAsc,
          name //按照服务名称搜索数据
        } = state.searchPage;
        let params = {
          pageNo: state.pagination.current,
          pageSize: state.pagination.pageSize,
          orderByFiled,
          isAsc,
          name
        };
        return params;
      },

      //获取回收站数据'
      getTrashList:()=> {
        state.loading = true;
        let searchPageObj = dataMethods.getParams();
        let datas = state.trashList;
        if (searchPageObj.name && searchPageObj.name != '') {
          datas = datas.filter((e) => {
            if (e.name.indexOf(searchPageObj.name) >= 0) return e;
          });
        }
        state.trashList = datas;
        state.pagination.total = datas.length;
        state.loading = false;
        // serviceBaseApi
        //   .trashPage(searchPageObj)
        //   .then((res) => {
        //     if (res ) {
        //       let datas = res;
        //       this.trashList = datas.records;
        //       this.pagination.total = datas ? datas.total : 0;
        //       this.loading = false;
        //     }
        //   })
        //   .catch((e) => {
        //     this.loading = false;
        //   });
      }
    };
    const tableMethods = {
      clearChache:()=> {
        state.loading = false;
        state.trashList = [];
      },
      cancelFrom:()=> {
        tableMethods.clearChache();
        emit('hideView', 'false');
        emit('refreshF'); //关闭窗口刷新父页面
      },

    
      //搜索回收站
      searchTrashList:()=> {
        //根据输入内容模糊查询服务名称
        state.pagination.current = 1;
        dataMethods.getTrashList();
      },
      //重置搜索框
      reset:()=> {
        //重置搜索框之后是否进行页面初始化？ 重置搜索之后初始化数据
        state.searchPage = {
          orderByFiled: 'update_time',
          isAsc: false,
          name: ''
        };
        state.pagination.current = 1;
        state.pagination.pageSize = 10;
        dataMethods.getTrashList();
      },
      //恢复数据
      reCover:(row)=> {
        Modal.confirm({
          title: '提示',
          content: <span>您确定要恢复【{<span class="text-primary">{row.name}</span>}】吗？</span>  ,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            serviceBaseApi.reBackDelInfo(row.id).then((res) => {
              if (res) {
                state.$message.success('恢复成功！');
                state.pagination.current = 1;
                dataMethods.getTrashList();
              }
            });
          }
        });
      },
      //永久删除
      deleteForever:(row)=> {
        Modal.confirm({
          title: '提示',
          content: <span>您确定要删除【{<span class="text-primary">{row.name}</span>}】吗？</span>  ,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // serviceBaseApi.deleteForever(row.id).then((res) => {
            //   if (res) {
            //     that.$message.success('该配置项' + row.name + '删除成功');
            //     that.pagination.current = 1;
            //     that.getTrashList();
            //   }
            // });
            proxy.$message.success('该配置项' + row.name + '删除成功');
            state.trashList = state.trashList.filter((e) => {
              if (e.id != row.id) return e;
            });
            state.pagination.current = 1;
            dataMethods.getTrashList();
          }
        });
      }
    };
    const action = ref([
        {
          text: '恢复',
          //icon: 'sync',
          click: tableMethods.reCover
        },
        {
          text: '删除',
          //type:'danger',
          //icon: 'delete',
          click: tableMethods.deleteForever
        }
      ]);
    return {
      action,
      ...toRefs(state),
      ...tableMethods,
      ...dataMethods
    }

  }
};
</script>
