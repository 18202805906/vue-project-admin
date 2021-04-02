<template>
  <div class="container">
    <div v-for="(item, index) in menList" :key="index">
      <h3 class="title">
        <!-- <a-icon :type="item.icon" class="icon" /> -->
        <component :is="item.icon"></component>
        {{item.title}}
      </h3>
      <div style="border-bottom: 1px solid #E3EDFF;">
        <span
          v-for="(ele, key) in item.children"
          :key="key"
          class="item"
          @click="clickMenu(ele)"
          :class="{'clicked':ele.id === current}"
        >
          <!-- <a-icon :type="ele.icon" class="item-icon" /> -->
          <component :is="ele.icon"></component>
          {{ele.title}}
        </span>
      </div>
    </div>
    <div class="search">
      <span
        class="history"
        v-for="(item, index) in history.slice(0,3)"
        :key="index"
        @click="changeKeywords(item)"
      >{{item.title}}</span>
      <a-auto-complete
        style="width: 200px;margin-left: 20px;"
        v-model:value="keywords"
       
        @search="handleSearch"
      >
        <template #options>
          <a-select-option
            v-for="item in data"
            :key="item.title"
            @click="selectData(item)"
          >{{ item.title }}</a-select-option>
        </template>
        <a-input class="input">
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>
      </a-auto-complete>
    </div>
  </div>
</template>

<script>
import { getStorage, setStorage } from '@/utils/storage';
import { toRefs, reactive } from 'vue';
export default {
  setup(props) {
    let menList = [
        {
          icon: 'calendar-outlined',
          title: '政务服务平台',
          children: [
            {
              id: 0,
              icon: 'cloud-outlined',
              title: '数据中心',
              url: 'https://www.baidu.com'
            },
            {
              id: 1,
              icon: 'cloud-outlined',
              title: '业务中台',
              url: 'https://www.baidu.com'
            },
            {
              id: 2,
              icon: 'cloud-outlined',
              title: '一体化在线政务服务平台',
              url: 'https://www.baidu.com'
            },
            {
              id: 3,
              icon: 'cloud-outlined',
              title: '“互联网+监管”平台',
              url: 'https://www.baidu.com'
            },
            {
              id: 4,
              icon: 'cloud-outlined',
              title: '“互联网+督察”平台',
              url: 'http://www.baidu.com/'
            }
          ]
        },
        {
          icon: 'dashboard-outlined',
          title: '数据中台',
          children: [
            {
              id: 5,
              icon: 'cloud-outlined',
              title: '数据交换系统',
              url: 'http://www.baidu.com/'
            },
            {
              id: 6,
              icon: 'cloud-outlined',
              title: '服务聚合管理系统',
              url: 'http://www.baidu.com/'
            },
            {
              id: 7,
              icon: 'cloud-outlined',
              title: '数据资源管理系统',
              url: 'http://www.baidu.com/'
            },
            {
              id: 8,
              icon: 'cloud-outlined',
              title: '基于区块链的可信共享交换平台',
              url: 'http://www.baidu.com/'
            },
            {
              id: 9,
              icon: 'cloud-outlined',
              title: '运维监管系统',
              url: 'http://www.baidu.com/'
            }
          ]
        },
        {
          icon: 'control-outlined',
          title: '数据资源管理系统',
          children: [
            {
              id: 10,
              icon: 'cloud-outlined',
              title: '数据大盘',
              url: 'http://www.baidu.com/'
            },
            {
              id: 11,
              icon: 'cloud-outlined',
              title: '数据治理',
              url: 'http://www.baidu.com/'
            },
            {
              id: 12,
              icon: 'cloud-outlined',
              title: '基础库',
              url: 'http://www.baidu.com/'
            },
            {
              id: 13,
              icon: 'cloud-outlined',
              title: '综合服务',
              url: 'http://www.baidu.com/'
            }
          ]
        }
      ];
      const state = reactive({
        current: -1,
        history: getStorage('searchHistory') || [],
        keywords: undefined,
        data: []
      });
      // 选择菜单
    const clickMenu = (item) => {
      state.current = item.id;
      window.open(item.url, '_blank');
    };
    // 搜索
    const handleSearch = (val) => {
      let arr = [];
      menList.forEach((item) => {
        item.children.forEach((ele) => {
          if (ele.title.includes(val)) {
            arr.push(ele);
          }
        });
      });
      state.data = arr;
    };
    // 选择搜索结果
    const selectData = (value) => {
      state.history.push(value);
      setStorage('searchHistory', state.history);
      state.history = getStorage('searchHistory');
      window.open(value.url, '_blank');
    };
    // 点击搜索历史
    const changeKeywords = (item)=> {
      state.keywords = item;
      handleSearch(item);
    };
    return{
      menList,
      ...toRefs(state),
      handleSearch,
      clickMenu,
      selectData,
      changeKeywords
    }
  }
};
</script>

<style lang="scss" scoped>
  .container {
    padding-top: 10px;
    width: 95%;
    margin: 0 auto;
    position: relative;
    z-index: 99;
    .title {
      margin-top: 20px;
      color: #00479d;
      font-weight: 600;
      font-size: 20px;
      line-height: 20px;
      .icon {
        margin-right: 15px;
      }
    }
    .item {
      display: inline-block;
      margin: 0px 20px 10px 0;
      padding: 0 20px;
      height: 30px;
      line-height: 30px;
      border-radius: 2px;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      transition: all .5s ease;
      .item-icon {
        color: #1890ff;
      }
    }
    .item:hover,.clicked {
      background: #1890ff;
      color: #fff;
      .item-icon {
        color: #fff;
      }
    }
    .search {
      position: absolute;
      top: 10px;
      right: 0;
      .input {
        width: 200px;
        //   background-color: rgba($color: #E3EDFF, $alpha: .3);
        //   border: 1px solid #E3EDFF;
      }
      .history {
        color: #00479d;
        font-size: 12px;
        background: #f2f7ff;
        border-radius: 4px;
        padding: 4px 8px;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
</style>