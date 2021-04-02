import { createStore } from "vuex";
import config from '@/config';
import user from './modules/user';

export default createStore({
  state: {
    theme: config.theme
  },
  mutations: {},
  actions: {},
  modules: {
    user
  }
});
