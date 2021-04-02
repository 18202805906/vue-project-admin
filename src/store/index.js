import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import { theme } from '@/config';
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    theme,
    globalLoading: false
  },
  mutations: {
    setGlobalLoading(state, val = false) {
      state.globalLoading = val;
    }
  },
  actions: {},
  modules: {
    user
  }
});
