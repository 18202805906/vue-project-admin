<template>
  <div>
    <div v-if="!dialogVisible && !detailVisible && !configVisible">
      <a-row>
        <a-col :span="24">
          <a-card>
            <span>
              <a-button type="primary" icon="plus" style="margin-right: 10px" @click="addPage" ghost>新建 </a-button>
              <a-button type="primary" icon="delete" @click="trashPage" style="margin-right: 10px" ghost>回收站 </a-button>
              <a-button type="primary" ghost @click="toApiCombinationHome"> 服务编排 </a-button>
            </span>

            <!-- <a-select placeholder="接口类型" v-model="searchPage.apiType" style="width: 33%; margin-left: 3px">
                  <a-select-option v-for="item in apiTypeList" :value="item.code" :key="item.id">{{ item.name }} </a-select-option>
                </a-select> -->

            <!-- <a-select placeholder="层级" v-model="searchPage.deptLevel" style="width: 22%; margin-left: 3px">
                  <a-select-option v-for="item in levelList" :value="item.code" :key="item.id">{{ item.name }} </a-select-option>
                </a-select>
                <a-select placeholder="业务域" v-model="searchPage.businessArea" style="width: 22%; margin-left: 3px">
                  <a-select-option v-for="item in domainList" :value="item.code" :key="item.id">{{ item.name }} </a-select-option>
                </a-select> -->
            <span class="fr flex" style="width: 50%">
              <a-input placeholder="请输入接口名称..." @change="searchList" v-model.trim="searchPage.name"></a-input>
              <a-select placeholder="分组" v-model="searchPage.groupNo" style="width: 100%; margin-left: 3px">
                <a-select-option v-for="item in groupList" :value="item.code" :key="item.id">{{ item.name }} </a-select-option>
              </a-select>
              <a-button type="primary" icon="search" @click="searchList" style="margin-left: 10px">搜索 </a-button>
              <a-button type="primary" @click="reset" style="margin-left: 10px" ghost>重置 </a-button>
            </span>
          </a-card>
        </a-col>
      </a-row>
      <a-row style="margin-top: 4px">
        <a-col :span="24">
          <a-card>
            <base-table :columns="columns" :dataSource="tableData" :action="action" :pagination="pagination" :loading="tableLoading"> </base-table>
          </a-card>
        </a-col>
      </a-row>
      <!-- 回收站 -->
      <service-api-trash
        ref="apiTrash"
        :trashVisible="trashVisible"
        @hideView="hideView"
        @refreshF="
          () => {
            getServiceApiList();
          }
        "
      />
    </div>
    <!-- 添加框 -->
    <transition mode="out-in" name="fade-transform">
      <service-api-add
        :visible="dialogVisible"
        ref="serviceAdd"
        :apiName="apiInfo.name ? apiInfo.name : ''"
        @saveToTable="saveToTable"
        @hideView="hideView"
        :operation="operation"
        :groupList="groupList"
      />
    </transition>
    <!-- 详情 -->
    <transition mode="out-in" name="fade-transform">
      <service-api-detail :detailVisible="detailVisible" ref="serviceApiDetail" :detailInfo="apiInfo" @hideView="hideView"></service-api-detail>
    </transition>
    <!-- 配置 -->
    <transition mode="out-in" name="fade-transform">
      <service-api-config :configVisible="configVisible" ref="serviceApiConfig" :apiInfo="apiInfo" @hideView="hideView"></service-api-config>
    </transition>
  </div>
</template>

<script>
import BaseTable from '@/components/BasisTable/index';
import ServiceApiTrash from './components/serviceApiTrash';
//import serviceTypeApi from '@/api/serviceApiType';
import serviceBaseApi from '@/api/serviceApiBase';
//import routingInspectionApi from '@/api/routingInspectionMember';
import ServiceApiAdd from './components/serviceApiAdd';
import ServiceApiDetail from './components/serviceApiDetail';
import ServiceApiConfig from './components/serviceApiConfig';
import Cookie from 'js-cookie';
import { apiStatus } from '@/filters/index';
import { Modal } from 'ant-design-vue';
import { pagination } from '@/config';
//import mockData from './mockData';

export default {
  name: 'serviceApi',
  // 注册组件
  components: {
    BaseTable,
    ServiceApiTrash,
    ServiceApiAdd,
    ServiceApiDetail,
    ServiceApiConfig
  },
  // 数据参数
  data() {
    const columns = [
      {
        title: '接口名称',
        dataIndex: 'name',
        ellipsis: true
      },
      {
        title: '分组',
        dataIndex: 'groupName',
        ellipsis: true
      },
      {
        title: '接口路径',
        dataIndex: 'openPath',
        align: 'center',
        ellipsis: true
      },
      {
        title: '请求方式',
        dataIndex: 'innerMethod',
        width: 100
      },
      {
        title: '状态',
        dataIndex: 'status',
        ellipsis: true,
        width: 100,
        customRender: (text, record) => {
          const status = apiStatus(record.status);
          return <a-badge status={status == '待发布' ? 'warning' : status == '已发布' ? 'processing' : 'warning'} text={status} />;
        },
        filters: [
          {
            text: '待发布',
            value: '0'
          },
          {
            text: '已发布',
            value: '1'
          },
          {
            text: '已下线',
            value: '2'
          }
        ],
        onFilter: (value, record) => record.status == value
      },
      {
        title: '版本',
        dataIndex: 'version',
        width: 80
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        ellipsis: true
      },
      // {
      //   title: '所属部门',
      //   dataIndex: 'departmentName',
      //   align: 'center',
      //   ellipsis: true
      // },
      {
        title: '操作',
        width: '250px',
        ellipsis: true,
        align: 'center',
        key: 'action',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ];
    return {
      // 接口类型
      apiTypeList: [],
      // //业务域
      // domainList: [],
      // //层级
      // levelList: [],
      //用于确定是新增还是修改
      operation: 'add',
      //分组列表
      groupList: [],

      //接口信息
      apiInfo: {},
      //表格数据
      tableData: [
        {
          id: '1',
          name: '测试接口1',
          groupName: '分组1',
          groupNo: 'group1',
          openPath: '/api/test',
          innerMethod: 'POST',
          status: '0',
          version: 'v1.0',
          createTime: '2020/12/10'
        },
        {
          id: '2',
          name: '测试接口2',
          groupName: '分组2',
          groupNo: 'group2',
          openPath: '/api/test2',
          innerMethod: 'GET',
          status: '1',
          version: 'v1.1',
          createTime: '2020/12/10'
        }
      ],
      //回收站弹框
      trashVisible: false,
      //注册弹框
      dialogVisible: false,
      //详情页面
      detailVisible: false,
      //配置界面
      configVisible: false,
      //接口id
      serviceApiId: '',
      columns: [
        {
          title: '序号',
          customRender: (value, row, index) => `${(this.pagination.current - 1) * 10 + index + 1}`,
          align: 'center',
          width: '5%'
        },
        ...columns
      ],
      searchPage: {
        orderByFiled: 'update_time',
        isAsc: false,
        name: '',
        status: '',
        groupNo: undefined,
        apiType: undefined
      },
      tableLoading: false,
      pagination: {
        ...pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          console.log('改变每页展示的数量了', current, pageSize);
          this.pagination.current = current;
          this.pagination.pageSize = pageSize;
          this.getServiceApiList();
        },
        onChange: (val) => {
          console.log('翻页了', val);
          this.pagination.current = val;
          this.getServiceApiList();
        }
      },
      action: [
        {
          text: '配置',
          //icon: 'setting',
          //type: 'primary',
          click: this.handleConfig
        },
        {
          text: '修改',
          //icon: 'edit',
          //type: 'primary',
          click: this.handleEdit
        },
        {
          text: '更多',
          //icon: 'down',
          children: [
            {
              text: '详情',
              icon: 'profile',
              click: this.handleDetail
            },
            {
              text: '删除',
              icon: 'delete',
              click: this.handleDel
            }
          ]
        }
      ]
    };
  },
  methods: {
    searchList() {
      this.pagination.current = 1;
      this.getServiceApiList();
    },
    getServiceApiList() {
      this.tableLoading = true;
      let params = {
        pageNo: this.pagination.current,
        pageSize: this.pagination.pageSize,
        name: this.searchPage.name,
        orderByFiled: this.searchPage.orderByFiled,
        isAsc: this.searchPage.isAsc,
        status: this.searchPage.status,
        groupNo: this.searchPage.groupNo,
        //groupName: this.searchPage.groupName,
        // deptLevel: this.searchPage.deptLevel,
        // businessArea: this.searchPage.businessArea,
        apiType: this.searchPage.apiType
      };

      let datas = this.tableData;
      if (params.name && params.name != '') {
        datas = datas.filter((e) => {
          if (e.name.indexOf(params.name) >= 0) return e;
        });
      }
      if (params.groupNo && params.groupNo != '') {
        datas = datas.filter((e) => {
          if (e.groupNo.indexOf(params.groupNo) === 0) return e;
        });
      }
      // datas.map((e) => {
      //   e.action = [

      //   ];
      // });
      this.tableData = datas;
      this.pagination.total = datas.length;
      this.tableLoading = false;
      // serviceBaseApi.queryForPage(params).then((res) => {
      //   this.tableData = res.records;
      //   this.pagination.total = res ? res.total : 0;
      //   this.tableLoading = false;
      // });
    },
    saveToTable(values) {
      values.status = '0';
      values.createTime = '';
      if (this.operation == 'add') {
        values.id = parseInt(Math.random() * (10000 - 0 + 1) + 0, 10);
      }
      if (this.operation == 'edit') {
        const datas = this.tableData;
        this.tableData = datas.map((e) => {
          if (e.id == values.id) {
            e = values;
          }
          return e;
        });
      } else {
        this.tableData.push(values);
      }
    },
    reset() {
      this.searchPage = {
        orderByFiled: 'update_time',
        isAsc: false,
        name: '',
        status: '',
        groupNo: undefined,
        // groupName: '',
        // deptLevel: undefined,
        // businessArea: undefined,
        apiType: undefined
      };
      this.pagination.pageSize = 10;
      this.pagination.total = 0;
    },
    //新建
    addPage() {
      this.serviceApiId = '';
      this.dialogVisible = true;
      this.operation = 'add';
    },
    //回收站
    trashPage() {
      this.trashVisible = true;
      this.$refs.apiTrash.getTrashList();
    },
    //跳转到服务编排
    toApiCombinationHome() {
      this.tableLoading = true;
      serviceBaseApi.toApiCombinationHome().then((res) => {
        this.tableLoading = false;
        if (res.code == 200) {
          let userName = res.data;
          console.log(res.data);
          Cookie.set('userName', userName);
          window.open(`${serviceBaseApi.toApiCombination}?userName=${userName}`);
        } else {
          const str = ` <div>
                                    <div>
                                        未配置系统数据,请前往
                                        <span class="warn">【系统管理】</span>→
                                        <span class="warn">【系统配置】</span>
                                    </div>
                                    <div>
                                        请在【系统配置】添加配置项代码API_COMBINATION_HOME_URL
                                    </div>
                                </div>`;
          this.$alert(str, '提示', {
            dangerouslyUseHTMLString: true
          }).then(() => {
            const range = document.createRange();
            range.selectNode(document.getElementById('code'));
            const selection = window.getSelection();
            if (selection.rangeCount > 0) selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
          });
        }
      });
    },
    //删除api
    handleDel(row) {
      // 删除
      if (row.status === 1) {
        this.$message({
          message: '该服务接口需要先下线才能删除',
          type: 'error'
        });
      } else {
        const that = this;
        Modal.confirm({
          title: '提示',
          content: <span>此操作将会将【{<span class="text-primary">{row.name}</span>}】放入回收站， 是否继续？</span>,
          okText: '确认',
          cancelText: '取消',
          onOk() {
            // routingInspectionApi.serviceApiExistInMembers({ serviceApiId: row.id }).then((res) => {
            //   if (res === false) {
            //     serviceBaseApi.delete(row.id).then((res) => {
            //       if (res === true) {
            //         that.$message.success('该配置项' + row.name + '放入回收站成功');
            //         that.getServiceApiList();
            //       }
            //     });
            //   } else {
            //     that.$message.error('该服务接口需要取消巡检才能删除');
            //   }
            // });
            that.$message.success('该配置项' + row.name + '放入回收站成功');
            that.$refs.apiTrash.trashList.push(
              ...that.tableData.filter((e) => {
                if (e.id == row.id) return e;
              })
            );
            that.tableData = that.tableData.filter((e) => {
              if (e.id != row.id) return e;
            });
            that.getServiceApiList();
          }
        });
      }
    },
    //配置
    handleConfig(row) {
      this.configVisible = true;
      this.apiInfo = row;
    },
    //查看详情
    handleDetail(row) {
      this.detailVisible = true;
      this.apiInfo = row;
    },

    //修改数据
    handleEdit(row) {
      //获取当前数据
      //this.serviceApiId = row.id;
      this.dialogVisible = true;
      this.operation = 'edit';
      this.apiInfo = row;
      this.$refs.serviceAdd.setFormData(row);
    },
    //获取接口类型
    getApiTypeList() {
      this.apiTypeList = [
        {
          code: 'phone',
          createAt: 'admin',
          createTime: '2018-08-27 14:41:52',
          deptCode: '001002001',
          flag: 0,
          grouping: null,
          id: 36,
          name: '手机号码',
          updateAt: 'admin',
          updateTime: '2020-09-29T09:54:45.000+08:00'
        },
        {
          code: 'phone1',
          createAt: 'admin',
          createTime: '2018-08-27 14:41:52',
          deptCode: '001002001',
          flag: 0,
          grouping: null,
          id: 37,
          name: '测试类型',
          updateAt: 'admin',
          updateTime: '2020-09-29T09:54:45.000+08:00'
        }
      ];
      // serviceTypeApi
      //   .all()
      //   .then((res) => {
      //     res.forEach((e) => {
      //       if (e.grouping !== '层级' && e.grouping !== '业务域') {
      //         this.apiTypeList.push(e);
      //       }
      //       // } else if (e.grouping === '层级') {
      //       //   this.levelList.push(e);
      //       // } else if (e.grouping === '业务域') {
      //       //   this.domainList.push(e);
      //       // }
      //     });
      //   })
      //   .catch((err) => {
      //     this.$message.error('获取接口类型异常');
      //   });
    },
    //获取分组
    getGroupList() {
      // serviceTypeApi
      //   .groupAll()
      //   .then((res) => {
      //     this.groupList = res;
      //   })
      //   .catch((err) => {
      //     this.$message.error('获取分组异常');
      //   });
      this.groupList = [
        { id: '1', code: 'group1', name: '分组1' },
        { id: '2', code: 'group2', name: '分组2' },
        { id: '3', code: 'group3', name: '分组3' }
      ];
    },
    // 关闭界面
    hideView(flag) {
      if (flag === 'false') {
        this.trashVisible = false;
        this.dialogVisible = false;
        this.detailVisible = false;
        this.configVisible = false;
      } else if (flag === 'true') {
        this.trashVisible = false;
        this.dialogVisible = false;
        // this.getServiceApiList();
      }
    }
  },
  created() {
    this.getApiTypeList();
    this.getGroupList();
    this.getServiceApiList();
  }
};
</script>

<style lang="less">
.enableClasss {
  color: red;
}

.disenableClass {
  color: gray;
}

.enableClass {
  color: green;
}
</style>
