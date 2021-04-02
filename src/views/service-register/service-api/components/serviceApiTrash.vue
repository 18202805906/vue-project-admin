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

<script>
import BaseTable from '@/components/BasisTable/index';
import serviceBaseApi from '@/api/serviceApiBase';
import { Modal } from 'ant-design-vue';
import { pagination } from '@/config';
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
    scopedSlots: { customRender: 'action' }
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
  data() {
    return {
      closeSrc: require('@/assets/images/modal/modal-close.png'),
      searchPage: {
        orderByFiled: 'update_time',
        isAsc: false,
        name: ''
      },
      loading: false,
      trashList: [],
      columns: Object.freeze(columns),
      pagination: {
        ...pagination,
        showTotal: (total) => `共 ${total} 条`,
        showQuickJumper: false,
        onChange: (val) => {
          this.pagination.current = val;
          this.getTrashList();
        }
      },
      action: [
        {
          text: '恢复',
          //icon: 'sync',
          click: this.reCover
        },
        {
          text: '删除',
          //type:'danger',
          //icon: 'delete',
          click: this.deleteForever
        }
      ]
    };
  },
  methods: {
    clearChache() {
      this.loading = false;
      this.trashList = [];
    },
    cancelFrom() {
      this.clearChache();
      this.$emit('hideView', 'false');
      this.$emit('refreshF'); //关闭窗口刷新父页面
    },

    //构建参数回收对象
    getParams() {
      let {
        orderByFiled,
        isAsc,
        name //按照服务名称搜索数据
      } = this.searchPage;
      let params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        orderByFiled,
        isAsc,
        name
      };
      return params;
    },

    //获取回收站数据'
    getTrashList() {
      this.loading = true;
      let searchPageObj = this.getParams();
      let datas = this.trashList;
      if (searchPageObj.name && searchPageObj.name != '') {
        datas = datas.filter((e) => {
          if (e.name.indexOf(searchPageObj.name) >= 0) return e;
        });
      }
      this.trashList = datas;
      this.pagination.total = datas.length;
      this.loading = false;
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
    },
    //搜索回收站
    searchTrashList() {
      //根据输入内容模糊查询服务名称
      this.pagination.current = 1;
      this.getTrashList();
    },
    //重置搜索框
    reset() {
      //重置搜索框之后是否进行页面初始化？ 重置搜索之后初始化数据
      this.searchPage = {
        orderByFiled: 'update_time',
        isAsc: false,
        name: ''
      };
      this.pagination.current = 1;
      this.pagination.pageSize = 10;
      this.getTrashList();
    },
    //恢复数据
    reCover(row) {
      const that = this;
      Modal.confirm({
        title: '提示',
        content: <span>您确定要恢复【{<span class="text-primary">{row.name}</span>}】吗？</span>  ,
        okText: '确认',
        cancelText: '取消',
        onOk() {
          serviceBaseApi.reBackDelInfo(row.id).then((res) => {
            if (res) {
              that.$message.success('恢复成功！');
              that.pagination.current = 1;
              that.getTrashList();
            }
          });
        }
      });
    },
    //永久删除
    deleteForever(row) {
      const that = this;
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
          that.$message.success('该配置项' + row.name + '删除成功');
          that.trashList = that.trashList.filter((e) => {
            if (e.id != row.id) return e;
          });
          that.pagination.current = 1;
          that.getTrashList();
        }
      });
    }
  }
};
</script>
