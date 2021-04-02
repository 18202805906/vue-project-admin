<template>
  <a-card>
    <div class="title-box">基本信息</div>
    <div class="content-box" style="max-width: 1200px">
      <a-form ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-item has-feedback label="组件名称" name="name">
              <a-input v-model:value="form.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="组件分组" name="groupId">
              <a-select v-model:value="form.groupId" placeholder="请选择角色" style="width: 100%">
                <a-select-option v-for="item in group" :key="item.id" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="唯一标识" name="id">
              <a-input v-model:value="form.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="优先级" name="priority">
              <a-input v-model:value="form.priority"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="组件版本" name="version">
              <a-input v-model:value="form.version"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="执行位置" name="position">
              <a-input v-model:value="form.position"></a-input>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="组件图标" name="icon">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                @change="handleChange"
              >
                <img v-if="form.icon" :src="form.icon" alt="avatar" class="upload-img" />
                <div v-else>
                  <loading-outlined  v-if="loading === 'loading'"/>
                  <plus-outlined v-else/>
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item has-feedback label="扩展内容" name="extend">
              <a-textarea :rows="5" v-model:value="form.extend"></a-textarea>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item has-feedback label="组件说明" name="description" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-textarea :rows="5" v-model:value="form.description"></a-textarea>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="title-box">配置属性</div>
    <a-button type="primary" style="margin-bottom:10px" ghost @click="handleAdd">
      <template #icon>
        <plus-outlined />
      </template>
      新建 
    </a-button>
    <div class="content-box">
      <a-table :columns="columns" :data-source="tableData" size="small" row-key="id" :pagination="false">
        <template #action="{record}">
          <div>
          <a-button @click="handleEdit(record)" type="link" size="small" :style="{padding: '0'}">保存</a-button>
          <a-divider type="vertical" :style="{width: '2px', background: '#5ea4ff'}" />
          <a-button @click="handleDel(record)" type="link" size="small" :style="{padding: '0'}">删除</a-button>
        </div>
        </template>
        
      </a-table>
    </div>
    <div class="btn-group">
      <a-button type="primary" style="margin-right:10px" ghost @click="handleAdd">新建 </a-button>
      <a-button @click="handleCancel">取消 </a-button>
    </div>
  </a-card>
</template>
<script>
import { getCurrentInstance, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const columns = [
      { title: '属性名称', dataIndex: 'name', ellipsis: true },
      { title: '属性参数', dataIndex: 'params', ellipsis: true },
      { title: '默认值', dataIndex: 'default' },
      { title: '分组说明', dataIndex: 'description', ellipsis: true },
      { title: '配置类型', dataIndex: 'type' },
      { title: '操作', slots: { customRender: 'action' }, align: 'center', width: 200 }
    ];
const group =[
        {
          title: '条目一',
          id: 1
        },
        {
          title: '条目二',
          id: 2
        },
        {
          title: '条目三',
          id: 3
        },
        {
          title: '条目四',
          id: 4
        }
      ];
const tableData =[
        {
          id: 1,
          name: '时间戳',
          params: 'client_id',
          default: 'admin',
          description: '作为时间戳的唯一标识',
          type: '基于授权'
        },
        {
          id: 2,
          name: '时间戳',
          params: 'client_id',
          default: 'admin',
          description: '作为时间戳的唯一标识',
          type: '基于授权'
        },
        {
          id: 3,
          name: '时间戳',
          params: 'client_id',
          default: 'admin',
          description: '作为时间戳的唯一标识',
          type: '基于授权'
        }
      ];
export default {


  setup(){
    const {proxy} = getCurrentInstance();
    const router = useRouter();
    let state = reactive({
      form: {
        name: '',
        groupId: 1,
        id: '',
        priority: 1,
        version: '',
        position: '',
        icon: '',
        extend: '',
        description: ''
      },
      rules: {},
      loading: false,
      columns: Object.freeze(columns),
      tableData,
      group
    });
    const methods = {
      handleAdd:() =>{

      },
      handleCancel: ()=>{
        router.go(-1);
      },
      handleChange:(info)=> {
        if (info.file.status === 'uploading') {
          state.loading = true;
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          getBase64(info.file.originFileObj, (imageUrl) => {
            state.form.icon = imageUrl;
            state.loading = false;
          });
        }
      },
      beforeUpload:(file)=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          proxy.$message.error('只能上传图片!');
        }
        const isLtM = file.size / 1024 / 1024 < 10;
        if (!isLtM) {
          proxy.$message.error('图片必须小于10MB!');
        }
        return isJpgOrPng && isLtM;
      }
    };
    return{
      ...toRefs(state),
      ...methods
    }

  }
};
</script>
<style lang="less" scoped>
.title-box {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  &:before {
    content: '';
    display: block;
    width: 3px;
    height: 15px;
    background-color: @primary-color;
    margin-right: 15px;
  }
}
.avatar-uploader &:deep(.ant-upload) {
  width: 120px;
  height: 120px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.upload-img {
  width: 120px;
  height: 120px;
}
.btn-group{
  text-align: center;
  margin-top: 20px;
}
</style>
