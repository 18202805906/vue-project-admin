<template>
  <div class="container" v-if="detailVisible">
    <div class="title-box">
      <span class="line"></span>
      <span class="title">{{ detailInfo.name }}</span>
      <a-button class="return" @click="returnApiPage" type="primary" icon="arrow-left" ghost>返回</a-button>
    </div>
    <div class="content">
      <a-row>
        <a-col :span="8" class="col-hidden">
          接口名称:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.name }} </template>
            <span class="txt">{{ detailInfo.name }}</span>
          </a-tooltip>
        </a-col>
        <a-col :span="8" class="col-hidden">
          请求URL:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.openPath }} </template>
            <span class="txt">{{ detailInfo.openPath }}</span>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8" class="col-hidden">
          接口分组:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.groupNo }} </template>
            <span class="txt">{{ detailInfo.groupNo }}</span>
          </a-tooltip>
        </a-col>
        <a-col :span="8" class="col-hidden">
          接口协议:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.serviceAgreement }} </template>
            <span class="txt">{{ detailInfo.serviceAgreement }}</span>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8" class="col-hidden">
          请求方式:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.innerMethod }} </template>
            <span class="txt">{{ detailInfo.innerMethod }}</span>
          </a-tooltip>
        </a-col>
        <a-col :span="8" class="col-hidden">
          响应时长:
          <a-tooltip>
            <template slot="title"> {{ detailInfo.concurrency }} </template>
            <span class="txt">{{ detailInfo.concurrency }}&nbsp;ms</span>
          </a-tooltip>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="15" style="display: inline-flex">
          <span style="width: 70px">接口说明:</span> <a-input  style="border: none;background: none;" type="textarea" class="txt" :autoSize="{ minRows: 6, maxRows: 8 }" disabled :value="detailInfo.description"> </a-input>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'serviceApiDetail',
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    detailInfo:{
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      //detailInfo: ''
    };
  },
  methods: {
    returnApiPage() {
      this.$emit('hideView', 'false');
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  background: #fff;
  border-radius: 3px;
  .title-box {
    padding: 20px;
    .line {
      display: inline-block;
      width: 3px;
      height: 15px;
      background-color: #0080ff;
    }
    .title {
      margin-left: 15px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: bold;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
      letter-spacing: 1px;
    }
    .return {
      cursor: pointer;
      float: right;
    }
  }
  .content {
    padding: 10px 0 10px 30px;
    .ant-row {
      padding-bottom: 10px;
    }
    .col-hidden {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 8px;
    }
    .txt {
      margin-left: 15px;
    }
  }
}
</style>
