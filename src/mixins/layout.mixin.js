import { mapState } from 'vuex';
import LSider from '@/layouts/components/LSider';
import LLogo from '@/layouts/components/LLogo.vue';
import LFooter from '@/layouts/components/LFooter';
import LHeader from '@/layouts/components/LHeader.vue';
import LBreadCrumb from '@/layouts/components/LBreadCrumb';
import { convertToTree } from '@/utils';
import { getStorage } from '@/utils/storage';
export default () => {
  return {
    components: {
      LSider,
      LFooter,
      LHeader,
      LLogo,
      LBreadCrumb
    },
    data() {
      return {
        menus: [],
        collapse: false
      };
    },

    computed: {
      ...mapState({
        theme: (state) => state.theme
      }),
      curtRoute() {
        return this.$route;
      },
      curtMenuKey() {
        return this.curtRoute.path ? [this.curtRoute.path] : [];
      },
      parentMenus() {
        return this.curtRoute.matched
          .filter((item) => item.meta?.name)
          .map((item) => ({
            icon: item.meta.icon,
            title: item.meta.name,
            url: item.path
          }));
      },
      openeds() {
        return this.collapse ? [] : this.parentMenus.map((item) => item.url);
      }
    },
    created() {
      let userInfo = getStorage('userinfo');
      if (userInfo) {
        this.$store.commit('user/SET_USERINFO', userInfo);
      } else {
        this.$router.push('/login');
      }
      let menus = getStorage('menus') || [];
      this.menus = convertToTree({ data: menus, pid: -1 });
    }
  };
};
