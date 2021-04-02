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
        <DownOutlined class="arrow" :class="{rotate: drawerVisible}" type="down" />
      </div>
      <transition mode="out-in" name="fade-transform">
        <div class="drawer" v-show="drawerVisible" @click="showDrawer">
          <div style="background:#fff;" @click.stop="drawerVisible = true">
            <l-nav-menu></l-nav-menu>
          </div>
        </div>
      </transition>

      <a-tooltip @click="$router.push('/home');">
        <template v-slot:title>首页</template>
        <HomeOutlined type="home" class="quick" />
      </a-tooltip>
      <a-tooltip @click="goToApi">
        <template v-slot:title>API文档</template>
        <FileTextOutlined class="quick" />
      </a-tooltip>
      <a-tooltip @click="$router.push('/system/message');">
        <template v-slot:title>有{{count}}未读消息</template>
        <a-badge :count="count" class="quick">
          <BellOutlined style="font-size:22px;"/>
        </a-badge>
      </a-tooltip>
      <a-dropdown>
        <div style="margin-left:10px;cursor: pointer;">
          <a-avatar size="default" style="backgroundColor:#B7D4FF">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          <span style="margin-left:10px;vertical-align: middle;color:#fff" @click.prevent>
            {{userInfo.username}}
            <DownOutlined style="margin-left:5px;font-size:10px;"  type="down" />
          </span>
        </div>
        <template #overlay>
          <a-menu @click="handleClick">
            <a-menu-item key="person">
              <ExclamationCircleOutlined type="exclamation-circle"/>修改密码
            </a-menu-item>
            <a-menu-item key="logout">
              <LogoutOutlined type="logout" />退出登录
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
    <l-update-psd v-model:visible="visiblePsd" @changeVisiblePsd="changeVisiblePsd"></l-update-psd>
  </a-layout-header>
</template>

<script>
import { useStore  } from 'vuex';
import { logout } from '@/router';
import { getStorage } from '@/utils/storage';
import { Modal } from 'ant-design-vue';
import LNavMenu from './LNavMenu';
import LUpdatePsd from './LUpdatePsd';
import { computed, ref, toRefs, createVNode } from 'vue';
import { DownOutlined, HomeOutlined, ExclamationCircleOutlined,LogoutOutlined, UserOutlined, FileTextOutlined, BellOutlined} from '@ant-design/icons-vue';
export default {
  components: {
    LNavMenu,
    LUpdatePsd,
    DownOutlined,
    HomeOutlined,
    ExclamationCircleOutlined,
    LogoutOutlined,
    UserOutlined,
    FileTextOutlined,
    BellOutlined
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
  setup(props, context) {
    const store = useStore()
    const {collapse} =  toRefs(props);
    let count = ref(getStorage('count') || 0);
    let visiblePsd = ref(false);
    let drawerVisible = ref(false);
    let userInfo = computed(() =>{
      return store.state.user.userinfo
    });
    const handleCollapse = () => {
      context.emit('update:collapse', !collapse);
    };
    const handleClick = ({ key }) => {
      switch (key) {
        case 'person':
          visiblePsd.value = true;
          break;
        case 'logout':
          Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: '您确定要退出吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
              logout();
            }
          });
          break;
      }
    };
    const goToApi = () => {
      alert('开发中!');
    };
    // 关闭修改密码弹框
    const changeVisiblePsd = (val) => {
      visiblePsd.value = val;
    };
    // 导航菜单是否显示
    const showDrawer = () => {
      drawerVisible.value = !drawerVisible.value;
    }

    return{
      count,
      visiblePsd,
      drawerVisible,
      userInfo,
      handleCollapse,
      handleClick,
      goToApi,
      changeVisiblePsd,
      showDrawer
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