<template>
  <div class="auth-content">
    <div class="list">
      <div class="list-item add" @click="handleAdd">
        <span>+ 新增组件</span>
      </div>
      <div v-for="item in showData" :key="item.id" class="list-item">
        <a-card :hoverable="true" :style="item.id == selectCardId ? { borderColor: '#1e93e7c2', borderWidth: '1px' } : { borderColor: '#eee', borderWidth: '1px' }" @click="clickCard(item)">
          <a-row style="height: 100px; padding: 0 10px 0 15px">
            <a-col :span="4">
              <span><img :src="src" class="card-img" /></span>
            </a-col>
            <a-col :span="20" class="card-content">
              {{ item.content }}
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="24">
              <div class="bottom-config">
                <a-row>
                  <a-col :span="11" @click="config(item)"> <span>配置</span></a-col>
                  <a-col :span="2"> <a-divider type="vertical" /></a-col>
                  <a-col :span="11"><span>启用</span></a-col>
                </a-row>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </div>
    </div>
    <a-divider :style="{ margin: '0 0 10px' }" />
    <div>
      <div class="title-box">
        <span class="line"></span>
        <span class="title">微信认证组件--基本信息</span>
      </div>
      <div class="detial-content" v-if="data.length">
        <a-row>
          <a-col :span="10"
            >组件名称： <span>{{ detailInfo.name }}</span></a-col
          >
          <a-col :span="10"
            >组件分类： <span>{{ detailInfo.class }}</span></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="10"
            >组件版本： <span>{{ detailInfo.version }}</span></a-col
          >
          <a-col :span="10"
            >创建时间： <span>{{ detailInfo.createTime }}</span></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="10"
            >执行位置： <span>{{ detailInfo.position }}</span></a-col
          >
          <a-col :span="10"
            >优先级： <span>{{ detailInfo.priority }}</span></a-col
          >
        </a-row>
        <a-row>
          <a-col :span="10">描述：</a-col>
        </a-row>
        <a-row>
          <a-col :span="20">{{ detailInfo.description }}</a-col>
        </a-row>
      </div>
    </div>
    <a-modal :title="configTitle + '----参数配置'" :visible="visible" :keyboard="false" :maskClosable="false" :confirm-loading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-model-item has-feedback label="组件名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入组件名称" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="组件分类" prop="class">
          <a-input v-model="form.code" placeholder="请输入组件分类" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="组件版本" prop="version">
          <a-input v-model="form.code" placeholder="请输入组件版本" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
const rules = {
  name: [{ required: true, trigger: 'change' }],
  class: [{ required: true, trigger: 'change' }],
  version: [{ required: true, trigger: 'change' }]
};
export default {
  name: 'authIndex',
  data() {
    return {
      closeSrc: require('@/assets/images/modal/modal-close.png'),
      loading: true,
      data: [],
      showData: [],
      detailInfo: {},
      src: require('@/assets/images/logo.png'),
      selectCardId: '',
      showLeftIcon: false,
      showRightIcon: false,
      configTitle: '',
      visible: false,
      confirmLoading: false,
      form: {},
      rules
    };
  },
  methods: {
    // 确认
    handleOk(e) {
      e.preventDefault();
      this.$message.success('保存成功');
      this.handleCancel();
    },
    // 取消
    handleCancel() {
      this.visible = false;
      this.$refs['ruleForm'].resetFields();
    },
    clickCard(item) {
      this.selectCardId = item.id;
      this.detailInfo = item;
    },
    nextConfig() {
      //获取第一个展示的一个card
      const firstCard = this.showData[0];
      this.showRightIcon = true;
      let firstIndex = '';
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == firstCard.id) {
          firstIndex = i;
          break;
        }
      }
      //如果是第一个
      if (firstIndex == 0) {
        return;
      }
      this.showData = this.data.slice(firstIndex - 1, firstIndex + 2);
      this.showLeftIcon = firstIndex == 1 ? false : true;
    },
    upConfig() {
      //获取最后展示的一个card
      const lastCard = this.showData[this.showData.length - 1];
      this.showLeftIcon = true;
      let lastIndex = '';
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id == lastCard.id) {
          lastIndex = i;
          break;
        }
      }
      //如果是最后一个
      if (lastIndex == this.data.length - 1) {
        return;
      }
      this.showData = this.data.slice(lastIndex - 1, lastIndex + 2);
      this.showRightIcon = lastIndex == this.data.length - 2 ? false : true;
    },
    config(item) {
      this.visible = true;
      this.configTitle = item.name;
    },
    //获取配置
    getDatas() {
      this.loading = true;
      this.data = [
        {
          id: '1',
          content:
            '1这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件',
          name: '微信token认证组件',
          class: '认证组件',
          version: 'V1.2',
          createTime: '2020-12-10',
          position: 'PRE/POST',
          priority: '高/中/低',
          description: '该组件作为同微信的token认证组件，能够实现接口同微信的互相认证访问。'
        },
        {
          id: '2',
          content: '2这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件',
          name: '微信token认证组件111',
          class: '认证组件111',
          version: 'V11.21',
          createTime: '2020-12-10',
          position: 'PRE/POST1',
          priority: '高/中/低1',
          description: '该组件作为同微信的token认证组件，11111。'
        },
        {
          id: '3',
          content: '3这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件',
          name: '',
          class: '',
          version: '',
          createTime: '',
          position: '',
          priority: '',
          description: ''
        },
        {
          id: '4',
          content: '4这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件',
          name: '',
          class: '',
          version: '',
          createTime: '',
          position: '',
          priority: '',
          description: ''
        },
        {
          id: '5',
          content: '5这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件，这是一个微信认证组件',
          name: '',
          class: '',
          version: '',
          createTime: '',
          position: '',
          priority: '',
          description: ''
        }
      ];
      this.selectCardId = this.data.length ? this.data[0].id : '';
      this.detailInfo = this.data.length ? this.data[0] : '';
      this.showRightIcon = this.data.length > 3 ? true : false;
      this.showData = this.data.slice(0, 3);
      this.loading = false;
    },
    handleAdd(){
      this.$router.push('/componentManager/basis/add');
    }
  },
  mounted() {
    this.getDatas();
  }
};
</script>

<style lang="less" scoped>
.auth-content {
  padding: 0 15px;
  .left-icon,
  .right-icon {
    position: relative;
    bottom: 100px;
    cursor: pointer;
  }
  .left-icon {
    margin-right: 1%;
  }
  .right-icon {
    margin-left: 1%;
  }
  /deep/ .ant-card-body {
    padding: 10px 0 0;
    height: 150px;
  }
  .list {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    margin-left: -5px;
    margin-right: -5px;
    .list-item{
      flex: 1 1 25%;
      margin: 0 5px;
      &.add{
        background-color: #F0F2F5;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #777;
        cursor: pointer;
        &:hover{
          color: #1890ff;
        }
      }
    }
  }
  .card-img {
    width: 35px;
  }
  .card-content {
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box; //作为弹性伸缩盒子模型显示。
    -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
    -webkit-line-clamp: 4; //显示的行
  }
  .bottom-config {
    height: 40px;
    background: #eee;
    /deep/ .ant-row {
      line-height: 40px;
      /deep/ .ant-col-11 {
        justify-content: center;
        display: flex;
        color: #b1aeaef2;
        font-size: 11px;
      }
    }
    .ant-divider {
      height: 20px;
      background: #0000002b;
    }
  }
  .title-box {
    .line {
      display: inline-block;
      width: 3px;
      height: 22px;
      background-color: #0080ff;
    }
    .title {
      position: absolute;
      margin-left: 15px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 1);
      line-height: 22px;
    }
  }
  .detial-content {
    padding-left: 20px;
    padding-top: 10px;
    .ant-col {
      line-height: 30px;
    }
  }
}
</style>
