<template>
  <a-layout-header class="layout-header">
    <div class="header-left">
      <slot name="logo"></slot>
      <!-- <a-icon class="trigger" :type="collapse ? 'menu-unfold' : 'menu-fold'" @click="handleCollapse" /> -->
      <slot name="breadCrumb"></slot>
    </div>
    <div class="header-right r-nw-fe-c">
      <div class="nav-menu" @click="showDrawer">
        导航菜单
        <a-icon class="arrow" :class="{rotate: drawerVisible}" type="down" />
      </div>
      <transition mode="out-in" name="fade-transform">
        <div class="drawer" v-show="drawerVisible" @click="showDrawer">
          <div style="background:#fff;" @click.stop="drawerVisible = true">
            <l-nav-menu></l-nav-menu>
          </div>
        </div>
      </transition>

      <a-tooltip @click="$router.push('/home');">
        <template slot="title">首页</template>
        <a-icon type="home" class="quick" />
      </a-tooltip>
      <a-tooltip @click="goToApi">
        <template slot="title">API文档</template>
        <a-icon type="file-text" class="quick" />
      </a-tooltip>
      <a-tooltip @click="$router.push('/system/message');">
        <template slot="title">有{{count}}未读消息</template>
        <a-badge :count="count" class="quick">
          <a-icon style="font-size:22px;" type="bell" />
        </a-badge>
      </a-tooltip>
      <a-dropdown>
        <div style="margin-left:10px;cursor: pointer;">
          <a-avatar size="default" style="backgroundColor:#B7D4FF" icon="user" />
          <span style="margin-left:10px;vertical-align: middle;color:#fff">
            {{userInfo.username}}
            <a-icon type="down" style="margin-left:5px;font-size:10px;" />
          </span>
        </div>
        <a-menu slot="overlay" @click="handleClick">
          <a-menu-item key="person">
            <a-icon type="exclamation-circle" />修改密码
          </a-menu-item>
          <a-menu-item key="logout">
            <a-icon type="logout" />退出登录
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <l-update-psd :visible="visiblePsd" @changeVisiblePsd="changeVisiblePsd"></l-update-psd>
  </a-layout-header>
</template>

<script>
import { mapState } from 'vuex';
import { logout } from '@/router';
import { getStorage } from '@/utils/storage';
import { Modal } from 'ant-design-vue';
import LNavMenu from './LNavMenu';
import LUpdatePsd from './LUpdatePsd';
export default {
  components: {
    LNavMenu,
    LUpdatePsd
  },
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    breadCrumb: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      count: getStorage('count') || 0,
      visiblePsd: false,
      drawerVisible: false
    };
  },
  computed: mapState({
    userInfo: (state) => state.user.userinfo
  }),
  methods: {
    handleCollapse() {
      this.$emit('update:collapse', !this.collapse);
    },
    handleClick({ key }) {
      switch (key) {
        case 'person':
          this.visiblePsd = true;
          break;
        case 'logout':
          Modal.confirm({
            title: '提示',
            content: '您确定要退出吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              logout();
            }
          });
          break;
      }
    },
    goToApi() {
      alert('开发中!');
    },
    // 关闭修改密码弹框
    changeVisiblePsd(val) {
      this.visiblePsd = val;
    },
    // 导航菜单是否显示
    showDrawer() {
      this.drawerVisible = !this.drawerVisible;
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header {
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  background-image: url('../../assets/images/top_bg.png');
  background-position: 80% 0;
  z-index: 11;
}
.header-left {
  display: flex;
  align-items: center;
}
.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  color: #eee;
  &:hover {
    color: #fff;
  }
}
.header-right {
  .quick {
    margin-right: 20px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
}
.nav-menu {
  position: relative;
  margin-right: 30px;
  cursor: pointer;
  width: 100px;
  height: 100%;
  font-size: 14px;
  letter-spacing: 1px;
  text-align: center;
  color: #fff;
  background-color: rgba($color: #fff, $alpha: 0.2);
  .arrow {
    transition: all .8s ease 0s;
  }
  .rotate {
    transform: rotate(180deg);
  }
}
.drawer {
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba($color: rgb(39, 30, 30), $alpha: 0.6);
}

</style>