<template>
  <a-popover  :placement="popoverPosition" :width="popoverWidth" :trigger="popoverTrigger" :title="popoverTitle">
    <template slot="content">
      <img src="../../assets/images/grammar/get.png" v-if="isImg && index === 0" />
      <img src="../../assets/images/grammar/exc.png" v-if="isImg && index === 1" />
      <img src="../../assets/images/grammar/map.png" v-if="isImg && index === 2" />
      <img src="../../assets/images/grammar/ran.png" v-if="isImg && index === 3" />
      <img src="../../assets/images/grammar/cut.png" v-if="isImg && index === 4" />
      <img src="../../assets/images/grammar/int.png" v-if="isImg && index === 5" />
      <img src="../../assets/images/grammar/hash.png" v-if="isImg && index === 6" />
      <img src="../../assets/images/grammar/hash.png" v-if="isImg && index === 7" />
      <div class="popover-content" v-html="popoverContent" v-else></div>
    </template>
    <a-icon type="question-circle" theme="filled"/>
    <!-- <i class="el-icon-question" slot="reference"></i> -->
  </a-popover>
</template>
<script>
import message from './message.json';

export default {
  name: 'helpMessage',
  props: {
    keyVal: {
      type: String
    },
    triggerWay: {
      type: String
    },
    width: {
      type: String
    },
    title: {
      type: String
    },
    position: {
      type: String
    },
    index: {
      type: Number
    },
    isImg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popoverTitle: this.title ? this.title : '帮助?',
      popoverWidth: this.width ? this.width : '200',
      popoverContent: '',
      popoverTrigger: this.triggerWay ? this.triggerWay : 'hover',
      popoverPosition: this.position ? this.position : 'topLeft',
      imgurl: ''
    };
  },
  methods: {
    takeMessage() {
      let val = this.keyVal;
      if (undefined == val || null == val || '' == val) return;
      for (let key in message) {
        if (val == key) {
          this.popoverContent = message[key];
          return;
        }
      }
    }
  },
  mounted() {
    this.takeMessage();
  }
};
</script>
<style scoped>
img {
  width: 100%;
  height: 100%;
}
</style>
