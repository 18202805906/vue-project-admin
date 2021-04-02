<template>
  <div class="login-page">
    <div class="title r-nw-fs-c">
      <img class="block" src="../../assets/images/login/icon-block.png" />
      <h1 style="margin-left: 15px; font-weight: bold">{{appTitle}}&nbsp;V{{version}}</h1>
    </div>
    <div class="bg-form">
        <a-carousel effect="fade" autoplay>
          <img class="bg" src="../../assets/images/login/login-bg1.jpg" />
          <img class="bg" src="../../assets/images/login/login-bg2.jpg" />
        </a-carousel>
      <div class="form-bg">
        <h2 style="text-align: center; letter-spacing: 1px; margin-bottom: 20px; color: #fff" clss="form-title">{{appTitle}}&nbsp;V{{version}}</h2>
        <a-form :model="loginInfo" :rules="rules" @keydown.enter="login" class="form" labelAlign="left" :wrapper-col="wrapperCol" ref="loginFormRef">
          <a-form-item name="username">
            <a-input auto-complete="off"  placeholder="账号" type="text" v-model:value="loginInfo.username">
             <template #prefix>
                <UserOutlined type="user" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input auto-complete="off" placeholder="密码" type="password" v-model:value="loginInfo.password">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="code">
            <div class="r-nw-sb-c">
              <a-input style="width: 55%" auto-complete="off" placeholder="验证码" v-model:value="loginInfo.code">
                <template #prefix>
                  <CheckCircleOutlined />
                </template>
              </a-input>
              <!-- <img width="35%;" height="32px" @click="changeCode()" :src="codeSrc" alt /> -->
            </div>
          </a-form-item>
          <a-form-item style="width: 100%">
            <a-button class="login" :loading="loading" @click.prevent="login" type="primary">登 录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <div class="bottom r-nw-c-c">
      <span @click="showVersions">版本号: <span class="version">{{ appTitle }} {{ version }}</span></span>
    </div>
  </div>
  <a-modal v-model:visible="isShowModal" title="更新日志" :footer="null" width="800px">
      <update-log></update-log>
  </a-modal>
</template>

<script>
import { set } from 'js-cookie';
import { setStorage } from '@/utils/storage';
import config from '@/config';
import AuthApi from '@/api/auth';
import UpdateLog from './components/UpdateLog.vue';
import {cryptoPassword} from '@/utils';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons-vue';
import { reactive , ref, toRefs, computed} from 'vue';
import {useRouter, useRoute} from 'vue-router';
import { defineComponent } from 'vue';

export default defineComponent ({
  components: { 
    UpdateLog,
    UserOutlined,
    LockOutlined,
    CheckCircleOutlined
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref();
    const isShowModal = ref(false);
    const state = reactive({
      loginInfo: {
        username: 'admin',
        password: '7b13s123!D@#',
        code: 'abcd',
        randomStr: ''
      },
      rules: {
        username: [
          {
            type: 'string',
            required: true,
            trigger: 'change',
            message: '请输入用户名'
          },
          // { validator: ruleUserName }
        ],
        password: [
          {
            type: 'string',
            required: true,
            trigger: 'change',
            message: '请输入密码'
          }
        ],
        code: [
          {
            type: 'string',
            required: true,
            trigger: 'change',
            message: '请输入验证码'
          }
        ]
      },
      loading: false,
      configTitle: '服务聚合V2.0',
      appTitle: config.appTitle,
      version: config.appVersion,
      codeSrc: '',
      wrapperCol: {span: 24}
    });
    //计算属性
    let redirect = computed(()=>{
      let noRedirect = ['/err', '/login'];
      let redirectUrl = route.query.redirect || '/';
      return noRedirect.includes(redirectUrl) ? '/' : redirectUrl;
    });

    //methods
    function getconfigTitle() {
      AuthApi.configTitle().then((res) => {
        state.configTitle = res;
      });
    };
    const showVersions = ()=> {
      isShowModal.value = true;
    };
    // 验证码
    function changeCode() {
      let str = new Date().getTime();
      state.loginInfo.randomStr = str;
      state.codeSrc = `${config.baseUrl}/uc/code/` + str;
    };
    // 登录
    function login() {
      loginFormRef.value.validate()
      .then((valid) => {
        if (valid) {
          state.loading = true;
          let { username, password, code, randomStr } = state.loginInfo;
          let sign = cryptoPassword(username + ':' + password + ':' + new Date().getTime());
          let params = {
            sign,
            grantType: 'password',
            scope: 'webapp',
            code,
            randomStr
          };
          AuthApi.login(params)
            .then((res) => {
              message.success('登录成功！');
              set(config.tokenKey, res.access_token);
              set(config.refreshTokenKey, res.refresh_token);
              set(config.tokenExpiresKey, Date.now() + res.expires_in * 1000 - config.refreshAheadTime);
              getMenuList();
              getUnloadCount();
              state.loading = false;
            })
            .catch(() => {
              state.loading = false;
              changeCode();
            });
        } else {
          state.loading = false;
          message.error('用户名或密码输入不正确！');
          changeCode();
          return false;
        }
      });
    };
    function getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        return cur !== 'redirect' ? (acc[cur] = query[cur]) : acc;
      }, {});
    };
    // 监听刷新
    function listenPage() {
      window.onbeforeunload = function (e) {
        e = e || window.event;
        if (e) {
          this.changeCode();
        }
        return;
      };
    };
    // 获取未读消息
    function getUnloadCount() {
      AuthApi.unloadCount().then((res) => setStorage('count', res));
    }
    // 储存菜单及用户信息
    function getMenuList() {
      AuthApi.getMenus({}).then((res) => {
        // 存储用户信息
        setStorage('userinfo', res.detail);
        setStorage('permissions', res.btnPermissions);
        // 存储返回的菜单
        setStorage('menuList', res.menus);
        //console.log('useRouter: ', useRouter);
        //console.log('useRoute: ', useRoute);
        console.log('dd',getOtherQuery(route.query))
        // router.replace({
        //   path: redirect,
        // });
        router.replace(redirect)
      });
    }
    return{
      //参数字段
      ...toRefs(state),
      isShowModal,
      loginFormRef,
      redirect,
      getconfigTitle,
      listenPage,
      login,
      showVersions
    }
  }
});
</script>

<style lang="less" scoped>
.login-page {
  // width: 100vw;
  height: 100vh;
  .title {
    margin-left: 45px;
    height: 15vh;
    letter-spacing: 2px;
    .block {
      width: 30px;
      height: 30px;
    }
  }
  .bg-form {
    position: relative;
    .form-bg {
      padding: 20px;
      background: rgba(0, 0, 0, 0.4);
      position: absolute;
      top: 15vh;
      right: 88px;
      z-index: 999;
      .form {
        width: 320px;
        .login {
          margin-top: 10px;
          width: 100%;
          height: 40px;
        }
      }
    }
    .bg {
      width: 100%;
      height: 75vh;
    }
  }
  .about-psd {
    color: rgba(250, 250, 250, 0.8);
    margin-top: 5px;
    cursor: pointer;
  }
  .bottom {
    height: 10vh;
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    .version {
      padding-left: 10px;
      color: #40a9ff;
    }
  }
}
</style>