<template>
  <a-modal title="修改密码" :visible="visible" :confirm-loading="confirmLoading" @cancel="handleCancel" :keyboard="false" :maskClosable="false">
    <a-form
      class="form"
      :model="updatePwdForm"
      :rules="rules"
      @keydown.enter="updatePsd"
      ref="updatePsdFormRef"
      :label-col="{ span: 5 }"
      :wrapper-col="{span: 18}"
    >
      <a-form-item name="oldPassword" label="原始密码">
        <a-input
          auto-complete="off"
          placeholder="请输入原始密码"
          type="password"
          v-model:value="updatePwdForm.oldPassword"
        ></a-input>
      </a-form-item>
      <a-form-item name="newPassword" label="新密码">
        <a-input
          auto-complete="off"
          placeholder="请输入新密码"
          type="password"
          v-model:value="updatePwdForm.newPassword"
        ></a-input>
      </a-form-item>
      <a-form-item name="reNewPassword" label="重复密码">
        <a-input
          auto-complete="off"
          placeholder="请输入重复密码"
          type="password"
          v-model:value="updatePwdForm.reNewPassword"
        ></a-input>
      </a-form-item>
    </a-form>
     <template #footer>
      <a-button
        style="width:100%;margin: 10px 0"
        :loading="loading"
        @click.prevent="updatePsd"
        type="primary"
      >提 交</a-button>
    </template>
  </a-modal>
</template>

<script>
import { testPassWord } from '@/utils/validate';
import { cryptoPassword } from '@/utils';
import AuthApi from '@/api/auth';
import { ref, reactive } from 'vue';
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    let updatePwdForm = reactive({
			oldPassword: '',
			newPassword: '',
			reNewPassword: ''
		});
    let validateNewPassword = async (rule, value) => {
      let continueValue = testPassWord(value);
      if (continueValue) {
        let regx = new RegExp(/(^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,15}$)/);
        if (regx.test(value)) {
          return Promise.reject();
        } else {
          return Promise.reject('长度至少8位，至少一个大写字母，一个小写字母，一个特殊字符，一个数字！');
        }
      } else {
        return Promise.reject('不能输入连续数字或字符（如123、qwe）！');
      }
    };
    let validateRePassword = async (rule, value) => {
      if (value !== updatePwdForm.newPassword) {
         return Promise.reject('两次输入的新密码不一致');
      } else {
         return Promise.reject();
      }
    };
    const rules = {
			oldPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请输入原始密码'
				}
			],
			newPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请输入新密码'
				},
				{ validator: validateNewPassword }
			],
			reNewPassword: [
				{
					type: 'string',
					required: true,
					trigger: 'blur',
					message: '请再次输入密码'
				},
				{ validator: validateRePassword }
			]
		};
    const updatePsdFormRef = ref();
    
    let confirmLoading = ref(false);
    let loading = ref(false);
    //方法
    const handleCancel = () => {
      updatePsdFormRef.value.resetFields();
      context.emit('changeVisiblePsd', false);
    };
    const updatePsd = () =>{
      updatePsdFormRef.value.validate()
      .then((valid) => {
        if (valid) {
          loading.value = true;
          let { oldPassword, newPassword, reNewPassword } = updatePwdForm;
          let params = {
            oldPassword: cryptoPassword(oldPassword),
            newPassword: cryptoPassword(newPassword),
            reNewPassword: cryptoPassword(reNewPassword)
          };
          AuthApi.updatePsd(params).then((res) => {
            console.log(res, 333);
          });
        } else {
          loading.value = false;
          // this.$message.error('密码输入不正确！');
          return false;
        }
      });
    }
    return {
      updatePsdFormRef,
      rules,
		  confirmLoading,
		  loading,
		  updatePwdForm,
      updatePsd,
      handleCancel
    }
  }
};
</script>

<style lang="scss" scoped>
</style>