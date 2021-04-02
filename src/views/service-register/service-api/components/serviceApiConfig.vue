<template>
  <div v-if="configVisible" class="container">
    <a-card class="title-card">
      <span class="title">{{ apiInfo.name }}</span>
      <a-button class="return" @click="returnApiPage" type="primary" icon="arrow-left" ghost>返回</a-button>
    </a-card>
    <a-layout>
      <a-layout>
        <a-layout-sider hide-trigger :style="{ background: '#fff' }" class="left-menu">
          <a-card class="left-card">
            <a-menu theme="light" @select="selectItem" :default-selected-keys="[meueList[0].name]">
              <a-menu-item :name="item.name" v-for="item in meueList" :key="item.name">
                <span>{{ item.label }}</span>
              </a-menu-item>
            </a-menu>
          </a-card>
        </a-layout-sider>
        <a-layout class="right-layout">
          <a-layout-content class="right-conent">
            <transition mode="out-in" name="fade-transform">
              <div>
                <api-test v-if="selectName == 'apiTest'" />
                <assembly-config v-if="selectName == 'assemblyConfig'" />
              </div>
            </transition>
            <!-- <authIndex :longname="longname" :updateTrigger="updateTrigger" :currentRow="currentRow"
                                           :serviceApiObj="currentRow" v-if="acName === 'auth'" :name="rowname"/>
                                <limitIndex :currentRow="currentRow" :longname="longname" :id="rowid"
                                            v-if="acName === 'limit'" :dialogVisible="true" :updateTrigger=0
                                            :groupName="rowname"/>
                                <groupApi :currentRow="currentRow" :longname="longname" :serviceApiId="rowid"
                                          v-if="acName === 'api'" :updateTrigger=null :serviceName="rowname"/>
                                <configIndex :longname="longname" :serviceApiId="rowid" v-if="acName === 'pluginConfig'"
                                             :updateTrigger=null :serviceName="rowname"/>
                                <aFlowIndex :longname="longname" :updateTrigger="updateTrigers" :serviceApiId="rowid"
                                            v-if="acName === 'aFlow'" :name="rowname" :serviceName="rowname"/>
                                <bListIndex :longname="longname" :updateTrigger="updateTrigers" :serviceApiId="rowid"
                                            v-if="acName === 'bList'" :name="rowname" :serviceName="rowname"/>
                                <wListIndex :longname="longname" :name="rowname" :serviceName="rowname"
                                            v-if="acName === 'wList'" :updateTrigger="updateTrigers"
                                            :serviceApiId="rowid"/>

                                <groupApis :longname="longname" :groupId="rowid" v-if="acName === 'apiid'"
                                           :groupName="rowname"/>
                                <open-time :longname="longname" :groupId="rowid" v-if="acName === 'openTime'"
                                           :groupName="rowname"/>

                                <securityCon :currentRow="currentRow" :longname="longname" :id="rowid"
                                             v-if="acName === 'securityCons'" :dialogVisible="true" :updateTrigger=0
                                             :groupName="rowname"/> -->
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
import AssemblyConfig from './assemblyConfig';
import ApiTest from './apiTest';
import { reactive, toRefs } from 'vue';
export default {
  name: 'serviceApiConfig',
  props: {
    configVisible: {
      type: Boolean,
      default: false
    },
    apiInfo:{
      type: Object,
      default: ()=>{}
    }
  },
  components: {
    ApiTest,
    AssemblyConfig
  },
  setup(props, {emit}){
    const state = reactive({
      selectName: 'apiTest',
      meueList: [
        { name: 'apiTest', label: '接口测试' },
        { name: 'assemblyConfig', label: '组件配置' },
        { name: 'api', label: '应用授权' },
        { name: 'pluginConfig', label: '数据授权' },
        { name: 'bList', label: '黑名单' },
        { name: 'wList', label: '白名单' },
        { name: 'openTime', label: '开放时间' },
        { name: 'securityCons', label: '数据加密' }
      ]
    });
    const methods = {
      returnApiPage:()=> {
        emit('hideView', 'false');
      },
      selectItem:(item)=> {
        state.selectName = item.key;
      }
    };
    return {
      ...toRefs(state),
      ...methods
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  .ant-menu-root.ant-menu-vertical {
    border-right: none;
  }
  .title-card {
    margin-bottom: 5px;
    &:deep(.ant-card-body) {
      padding: 15px;
    }
    .title {
      font-size: 16px;
      font-weight: bold;
      line-height: 30px;
    }
    .return {
      cursor: pointer;
      float: right;
    }
  }
  .left-menu {
    &:deep(.ant-card-body) {
      padding: 0;
      text-align: center;
    }
    &:deep(.ant-card-bordered) {
      border: none;
    }
  }
  .right-layout {
    padding: 0 0px 0px 5px;
    width: 100%;
    height: 100%;
    &:deep(.ant-layout-content){
      height: 80vh;
      background: #fff;
    }
    .right-content {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
