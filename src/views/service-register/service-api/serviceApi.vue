<template>
  <div>
    <div v-if="!dialogVisible && !detailVisible && !configVisible">
      <a-row>
        <a-col :span="24">
          <a-card>
            <span>
              <a-button type="primary"  style="margin-right: 10px" @click="addPage" ghost>
                <template #icon>
                  <plus-outlined />
                </template>
                新建 
              </a-button>
              <a-button type="primary"  @click="trashPage" style="margin-right: 10px" ghost>
                <template #icon>
                  <delete-outlined />
                </template>
                回收站 
              </a-button>
              <!-- <a-button type="primary" ghost @click="toApiCombinationHome"> 服务编排 </a-button> -->
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
              <a-button type="primary" @click="searchList" style="margin-left: 10px">
                <template #icon>
                  <search-outlined />
                </template>
                搜索 
              </a-button>
              <a-button type="primary" @click="reset" style="margin-left: 10px" ghost>
                重置 
              </a-button>
            </span>
          </a-card>
        </a-col>
      </a-row>
      <a-row style="margin-top: 4px">
        <a-col :span="24">
          <a-card>
            <base-table :columns="columns" :dataSource="tableData" :action="action" :pagination="pagination"> </base-table>
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
import { getCurrentInstance, inject, reactive, toRefs, ref } from 'vue';
//import mockData from './mockData';
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
        customRender: ({record}) => {
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
        slots: { customRender: 'action' }
      }
    ];
const tableData = [
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
      ];
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

  setup(){
    const $pagination = inject('$pagination');
    const { proxy } = getCurrentInstance();
    let searchState = reactive({
      searchPage: {
        orderByFiled: 'update_time',
        isAsc: false,
        name: '',
        status: '',
        groupNo: undefined,
        apiType: undefined
      }
    });
    let state = reactive({
      apiTrash: ref(),
      serviceAdd: ref(),
      pagination: {
        ...$pagination,
        showTotal: (total) => `共 ${total} 条`,
        onShowSizeChange: (current, pageSize) => {
          console.log('改变每页展示的数量了', current, pageSize);
          state.pagination.current = current;
          state.pagination.pageSize = pageSize;
          this.getServiceApiList();
        },
        onChange: (val) => {
          console.log('翻页了', val);
          state.pagination.current = val;
          this.getServiceApiList();
        }
      },
      // 接口类型
      apiTypeList: [],
      //用于确定是新增还是修改
      operation: 'add',
      //分组列表
      groupList: [],
      //接口信息
      apiInfo: {},
      //表格数据
      tableData,
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
          customRender: ({index}) => `${(state.pagination.current - 1) * 10 + index + 1}`,
          align: 'center',
          width: '5%'
        },
        ...columns
      ],
      tableLoading: false,

    });

    const dataMethods = {
      getServiceApiList:()=> {
        state.tableLoading = true;
        let params = {
          pageNo: state.pagination.current,
          pageSize: state.pagination.pageSize,
          name: searchState.searchPage.name,
          orderByFiled: searchState.searchPage.orderByFiled,
          isAsc: searchState.searchPage.isAsc,
          status: searchState.searchPage.status,
          groupNo: searchState.searchPage.groupNo,
          apiType: searchState.searchPage.apiType
        };

        let datas = state.tableData;
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
        state.tableData = datas;
        state.pagination.total = datas.length;
        state.tableLoading = false;
        // serviceBaseApi.queryForPage(params).then((res) => {
        //   this.tableData = res.records;
        //   this.pagination.total = res ? res.total : 0;
        //   this.tableLoading = false;
        // });
      },
      //获取接口类型
      getApiTypeList:()=> {
        state.apiTypeList = [
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
      getGroupList:()=> {
        // serviceTypeApi
        //   .groupAll()
        //   .then((res) => {
        //     this.groupList = res;
        //   })
        //   .catch((err) => {
        //     this.$message.error('获取分组异常');
        //   });
        state.groupList = [
          { id: '1', code: 'group1', name: '分组1' },
          { id: '2', code: 'group2', name: '分组2' },
          { id: '3', code: 'group3', name: '分组3' }
        ];
      }
    };
    const topMthods = {
      searchList:()=> {
        state.pagination.current = 1;
        dataMethods.getServiceApiList();
      },
      reset:()=> {
        searchState.searchPage = {
          orderByFiled: 'update_time',
          isAsc: false,
          name: '',
          status: '',
          groupNo: undefined,
          apiType: undefined
        };
        state.pagination.pageSize = 10;
        state.pagination.total = 0;
      },
      //新建
      addPage() {
        state.serviceApiId = '';
        state.dialogVisible = true;
        state.operation = 'add';
      },
      //回收站
      trashPage() {
        state.trashVisible = true;
        state.apiTrash.getTrashList();
      },
      //跳转到服务编排
      toApiCombinationHome() {
        state.tableLoading = true;
        serviceBaseApi.toApiCombinationHome().then((res) => {
          state.tableLoading = false;
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
      }
    };
    const tableMethods = {
      saveToTable:(values)=> {
        values.status = '0';
        values.createTime = '';
        if (state.operation == 'add') {
          values.id = parseInt(Math.random() * (10000 - 0 + 1) + 0, 10);
        }
        if (state.operation == 'edit') {
          const datas = state.tableData;
          state.tableData = datas.map((e) => {
            if (e.id == values.id) {
              e = values;
            }
            return e;
          });
        } else {
          state.tableData.push(values);
        }
      },
      
      //删除api
      handleDel:(row) => {
        // 删除
        if (row.status === 1) {
          proxy.$message({
            message: '该服务接口需要先下线才能删除',
            type: 'error'
          });
        } else {
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
              proxy.$message.success('该配置项' + row.name + '放入回收站成功');
              state.apiTrash.trashList.push(
                ...state.tableData.filter((e) => {
                  if (e.id == row.id) return e;
                })
              );
              state.tableData = state.tableData.filter((e) => {
                if (e.id != row.id) return e;
              });
              dataMethods.getServiceApiList();
            }
          });
        }
      },
      //配置
      handleConfig:(row)=> {
        state.configVisible = true;
        state.apiInfo = row;
      },
      //查看详情
      handleDetail:(row)=> {
        state.detailVisible = true;
        state.apiInfo = row;
      },

      //修改数据
      handleEdit:(row)=> {
        //获取当前数据
        //this.serviceApiId = row.id;
        state.dialogVisible = true;
        state.operation = 'edit';
        state.apiInfo = row;
        state.serviceAdd.setFormData(row);
      },
      
      // 关闭界面
      hideView:(flag)=> {
        if (flag === 'false') {
          state.trashVisible = false;
          state.dialogVisible = false;
          state.detailVisible = false;
          state.configVisible = false;
        } else if (flag === 'true') {
          state.trashVisible = false;
          state.dialogVisible = false;
          // this.getServiceApiList();
        }
      }
    };
    const action = ref([
        {
          text: '配置',
          //icon: 'setting',
          //type: 'primary',
          click: tableMethods.handleConfig
        },
        {
          text: '修改',
          //icon: 'edit',
          //type: 'primary',
          click: tableMethods.handleEdit
        },
        {
          text: '更多',
          //icon: 'down',
          children: [
            {
              text: '详情',
              icon: 'profile-outlined',
              click: tableMethods.handleDetail
            },
            {
              text: '删除',
              icon: 'delete-outlined',
              click: tableMethods.handleDel
            }
          ]
        }
      ]);
    dataMethods.getApiTypeList();
    dataMethods.getGroupList();
    dataMethods.getServiceApiList();
    return{
      ...toRefs(searchState),
      ...toRefs(state),
      ...dataMethods,
      ...tableMethods,
      ...topMthods,
      action
    }

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
