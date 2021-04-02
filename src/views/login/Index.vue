<template>
  <div class="login-page">
    <div class="title r-nw-fs-c">
      <img class="block" src="../../assets/images/login/icon-block.png" />
      <h1 style="margin-left: 15px; font-weight: bold">{{appTitle}}&nbsp;&nbsp;&nbsp;V{{version}}</h1>
    </div>
    <div class="bg-form">
        <a-carousel effect="fade" autoplay>
        <img class="bg" src="../../assets/images/login/login-bg1.jpg" />
        <img class="bg" src="../../assets/images/login/login-bg2.jpg" />
      </a-carousel>
      <div class="form-bg">
        <h2 style="text-align: center; letter-spacing: 1px; margin-bottom: 20px; color: #fff" clss="form-title">{{appTitle}}&nbsp;&nbsp;&nbsp;V{{version}}</h2>
        <a-form-model :model="loginInfo" :rules="rules" @keydown.enter.native="login('loginForm')" class="form" label-position="left" label-width="0px" ref="loginForm">
          <a-form-model-item prop="username">
            <a-input auto-complete="off" placeholder="账号" type="text" v-model="loginInfo.username">
              <a-icon slot="prefix" type="user" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="password">
            <a-input auto-complete="off" placeholder="密码" type="password" v-model="loginInfo.password">
              <a-icon slot="prefix" type="lock" style="color: rgba(0, 0, 0, 0.25)" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item prop="code">
            <div class="r-nw-sb-c">
              <a-input style="width: 55%" auto-complete="off" placeholder="验证码" v-model="loginInfo.code">
                <a-icon slot="prefix" type="check-circle" style="color: rgba(0, 0, 0, 0.25)" />
              </a-input>
              <!-- <img width="35%;" height="32px" @click="changeCode()" :src="codeSrc" alt /> -->
            </div>
          </a-form-model-item>
          <a-form-model-item style="width: 100%">
            <a-button class="login" :loading="loading" @click.native.prevent="login('loginForm')" type="primary">登 录</a-button>
          </a-form-model-item>
        </a-form-model>
      </div>
    </div>
    <div class="bottom r-nw-c-c">
      <span @click="isShowModal=true">版本号: <span class="version">{{ appTitle }} {{ version }}</span></span>
    </div>
    <!-- <a-modal v-model="isShowModal" title="更新日志" :footer="null" :width="800">
        <update-log></update-log>
    </a-modal> -->
  </div>
</template>

<script>
import { set } from 'js-cookie';
import { setStorage } from '@/utils/storage';
import config from '@/config';
import AuthApi from '@/api/auth';
import UpdateLog from './components/UpdateLog.vue';
import {cryptoPassword} from '@/utils';
export default {
  components: { UpdateLog },
  data() {
    // let ruleUserName = (rule, value, callback) => {
    //   AuthApi.userNameIsExist({ username: value }).then((res) => {
    //     if (res === false) {
    //       callback(new Error('用户名不存在'));
    //     } else {
    //       callback();
    //     }
    //   });
    // };
    return {
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
            trigger: 'blur',
            message: '请输入用户名'
          },
          // { validator: ruleUserName }
        ],
        password: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '请输入密码'
          }
        ],
        code: [
          {
            type: 'string',
            required: true,
            trigger: 'blur',
            message: '请输入验证码'
          }
        ]
      },
      loading: false,
      configTitle: 'vue2+antd后台管理系统V1.0',
      appTitle: config.appTitle,
      version: config.appVersion,
      codeSrc: '',
      isShowModal: false
    };
  },
  created() {
    // this.getconfigTitle();
    // this.changeCode();
    // this.listenPage();
  },
  computed: {
    redirect() {
      let noRedirect = ['/err', '/login'];
      let redirectUrl = this.$route.query.redirect || '/';
      return noRedirect.includes(redirectUrl) ? '/' : redirectUrl;
    }
  },
  methods: {
    // 获取大标题
    getconfigTitle() {
      AuthApi.configTitle().then((res) => {
        this.configTitle = res;
      });
    },
    // 验证码
    changeCode() {
      let str = new Date().getTime();
      this.loginInfo.randomStr = str;
      this.codeSrc = `${config.baseUrl}/uc/code/` + str;
    },
    // 登录
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true;
          let { username, password, code, randomStr } = this.loginInfo;
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
              this.$message.success('登录成功！');
              set(config.tokenKey, res.access_token);
              set(config.refreshTokenKey, res.refresh_token);
              set(config.tokenExpiresKey, Date.now() + res.expires_in * 1000 - config.refreshAheadTime);
              this.getMenuList();
              this.getUnloadCount();
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
              this.changeCode();
            });
        } else {
          this.loading = false;
          this.$message.error('用户名或密码输入不正确！');
          this.changeCode();
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        return cur !== 'redirect' ? (acc[cur] = query[cur]) : acc;
      }, {});
    },
    // 监听刷新
    listenPage() {
      window.onbeforeunload = function (e) {
        e = e || window.event;
        if (e) {
          this.changeCode();
        }
        return;
      };
    },
    // 获取未读消息
    getUnloadCount() {
      AuthApi.unloadCount().then((res) => setStorage('count', res));
    },
    // 储存菜单及用户信息
    getMenuList() {
      AuthApi.getMenus({}).then((res) => {
        // 存储用户信息
        setStorage('userinfo', res.detail);
        setStorage('permissions', res.btnPermissions);
        // 存储返回的菜单
        setStorage('menuList', res.menus);
        this.$router.replace({
          path: this.redirect,
          query: this.getOtherQuery(this.$route.query)
        });
      });
    }
  }
};
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