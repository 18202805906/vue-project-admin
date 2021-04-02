<template>
  <a-card>
    <div class="title-box">基本信息</div>
    <div class="content-box" style="max-width: 1200px">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-row :gutter="0">
          <a-col :span="12">
            <a-form-model-item has-feedback label="组件名称" prop="name">
              <a-input v-model="form.name"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="组件分组" prop="groupId">
              <a-select v-model="form.groupId" placeholder="请选择角色" style="width: 100%">
                <a-select-option v-for="item in group" :key="item.id" :value="item.id">
                  {{ item.title }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="唯一标识" prop="id">
              <a-input v-model="form.id"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="优先级" prop="priority">
              <a-input v-model="form.priority"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="组件版本" prop="version">
              <a-input v-model="form.version"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="执行位置" prop="position">
              <a-input v-model="form.position"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="组件图标" prop="icon">
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
                  <a-icon :type="loading ? 'loading' : 'plus'" />
                  <div class="ant-upload-text">上传</div>
                </div>
              </a-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item has-feedback label="扩展内容" prop="extend">
              <a-input type="textarea" :rows="5" v-model="form.extend"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item has-feedback label="组件说明" prop="description" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <a-input type="textarea" :rows="5" v-model="form.description"></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <div class="title-box">配置属性</div>
    <a-button type="primary" icon="plus" style="margin-bottom:10px" ghost @click="handleAdd">新建 </a-button>
    <div class="content-box">
      <a-table :columns="columns" :data-source="tableData" size="small" row-key="id" :pagination="false">
        <div slot="action" slot-scope="row">
          <a-button @click="handleEdit(row)" type="link" size="small">保存</a-button>
          <a-divider type="vertical" class="divider-primary" />
          <a-button @click="handleDel(row)" type="link" size="small">删除</a-button>
        </div>
      </a-table>
    </div>
    <div class="btn-group">
      <a-button type="primary" style="margin-right:10px" ghost @click="handleAdd">新建 </a-button>
      <a-button >取消 </a-button>
    </div>
  </a-card>
</template>
<script>
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
export default {
  data() {
    const columns = [
      { title: '属性名称', dataIndex: 'name', ellipsis: true },
      { title: '属性参数', dataIndex: 'params', ellipsis: true },
      { title: '默认值', dataIndex: 'default' },
      { title: '分组说明', dataIndex: 'description', ellipsis: true },
      { title: '配置类型', dataIndex: 'type' },
      { title: '操作', scopedSlots: { customRender: 'action' }, align: 'center', width: 200 }
    ];
    return {
      group: [
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
      ],
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
      tableData: [
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
      ]
    };
  },
  methods: {
    handleAdd(){

    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true;
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (imageUrl) => {
          this.form.icon = imageUrl;
          this.loading = false;
        });
      }
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!');
      }
      return isJpgOrPng && isLt2M;
    }
  }
};
</script>
<style lang="scss" scoped>
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
    background-color: $primary-color;
    margin-right: 15px;
  }
}
.avatar-uploader ::v-deep .ant-upload {
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
