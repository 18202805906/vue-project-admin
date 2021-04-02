import { getToken } from '@/utils/token';
import { setStorage, getStorage } from '@/utils/storage';

/**
 * 获取管理用户信息
 * TOKEN: 临时密钥
 * NAME: 姓名
 * AVATAR: 头像地址
 * ROLES: 权限角色类型
 */
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  userinfo:{}
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_NAME(state, name)  {
    state.name = name;
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar;
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_USERINFO(state,data) {
    state.userinfo = data;
    setStorage('userinfo', data);
  }
};
const getters= {
  // TODO
  userinfo(state) {
    if (state.userinfo) return state.userinfo;
    let userInfo = getStorage('userinfo');
    if (userInfo) {
      state.userinfo = JSON.parse(userInfo);
      return state.userinfo;
    }
    return {};
  }
};
const actions = {
  // 更新用户信息
  getUserinfo({ commit }) {
    let userInfo = getStorage('userinfo');
    commit('SET_USERINFO',userInfo);
    setStorage('userinfo', userInfo);
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions
};
