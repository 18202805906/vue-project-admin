<template>
  <div class="container" v-if="visible">
    <a-spin :spinning="spinning">
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item class="btn-box r-nw-fe-c">
          <div class="service-sign-in">
            <div>{{ operation == 'add' ? '接口注册' : `修改${apiName}` }}</div>
            <div>
              <a-button type="primary" :style="{marginRight: operation ==='add' ? '': '8px'}"  html-type="submit">
                <template #icon>
                  <down-circle-outlined />
                </template>
                保存
              </a-button>
              <a-popconfirm placement="topLeft" title="是否需要重置" okText="Yes" cancelText="No" @confirm="confirm">
                <a-button type="primary" ghost v-if="operation == 'add' ? true: false" class="btn-reset" >
                  <template #icon>
                    <sync-outlined />
                  </template>
                  重置
                </a-button>
              </a-popconfirm>
              <!-- <a style="cursor: pointer" @click="returnApiPage"><a-icon type="arrow-left" />返回</a> -->
              <a-button @click="returnApiPage" type="primary" ghost>
                <template #icon>
                  <arrow-left-outlined />
                </template>
                返回
              </a-button>
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <div style="height: 4px; background: rgb(240, 242, 245)"></div>
        </a-form-item>
        <a-form-item>
          <div class="r-nw-fs-fs" style="width: 100%">
            <a-form-item class="left">
              <a-anchor :affix="false" :showInkInFixed="true">
                <a-anchor-link href="#info" title="基本信息" />
                <a-anchor-link href="#parameter" title="参数定义" />
                <a-anchor-link href="#result" title="返回结果" />
                <a-anchor-link href="#interface" title="帮助文档" />
              </a-anchor>
            </a-form-item>
            <a-form-item class="right" style="height: 73vh; overflow: auto">
              <!-- 基础信息 -->
              <div id="info" class="info-box base-box">
                <div class="title-box r-nw-fs-c">
                  <span class="line"></span>
                  <span class="title">基本信息</span>
                </div>
                <div class="info-box-content">
                  <a-form-item label="接口名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-input
                      v-decorator="['name', { rules: [{ required: true, message: '请输入接口名称' }], getValueFromEvent: (event) => event.target.value.replace(/\s+/g, '') }]"
                      placeholder="请输入接口名称"
                      :maxLength="20"
                    />
                  </a-form-item>
                  <a-form-item label="接口URL" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-input
                      placeholder="请输入接口URL"
                      v-decorator="['openPath', { rules: [{ required: true, message: '请输入接口URL' }], getValueFromEvent: (event) => event.target.value.replace(/\s+/g, '') }]"
                    />
                  </a-form-item>
                  <a-form-item class="row-item-box" style="margin-bottom: 0" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-row>
                      <a-col :span="9" style="padding-left: 8px">
                        <a-form-item label="分组" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
                          <a-select placeholder="请选择分组" v-decorator="['groupNo', { rules: [{ required: true, message: '请选择分组' }] }]">
                            <a-select-option v-for="item in groupList" :value="item.code" :key="item.id">{{ item.name }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item label="最大并发量" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                          <a-input-number
                            style="width: 100%"
                            placeholder="请输入最大并发量"
                            :min="1"
                            :max="9999"
                            :step="100"
                            v-decorator="['concurrency', { initialValue: 100 }, { rules: [{ required: true, message: '请输入最大并发量' }] }]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item class="row-item-box" style="marginbottom: 0" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-row>
                      <a-col :span="9" style="padding-left: 8px">
                        <a-form-item label="请求方式" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
                          <a-select placeholder="请选择" v-decorator="['innerMethod', { rules: [{ required: true, message: '请选择请求方式' }] }]">
                            <a-select-option v-for="item in request" :key="item.value" :value="item.value">{{ item.name }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item label="响应时长(ms)" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                          <a-input-number
                            style="width: 100%"
                            placeholder="请输入响应时长ms为单位,只能为数字"
                            :min="1"
                            :max="999999999"
                            :step="1000"
                            v-decorator="['concurrency', { initialValue: 1000 }, { rules: [{ required: true, message: '请输入响应时长' }] }]"
                          />
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item class="row-item-box" style="marginbottom: 0" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-row class="sws">
                      <a-col :span="9">
                        <a-form-item label="接口协议" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
                          <a-select placeholder="请选择接口协议" v-decorator="['serviceAgreement', { rules: [{ required: true, message: '请选择接口协议' }] }]">
                            <a-select-option v-for="item in serveHttp" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item label="数据协议" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                          <a-select placeholder="请选择数据协议" v-decorator="['innerAgreement', { rules: [{ required: true, message: '请选择数据协议' }] }]">
                            <a-select-option value="0">RESTful</a-select-option>
                            <a-select-option value="1">webservice</a-select-option>
                            <a-select-option value="2">webservice(soap)</a-select-option>
                          </a-select>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item class="row-item-box" style="marginbottom: 0" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-row class="sws">
                      <a-col :span="9">
                        <a-form-item label="所属部门" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
                          <a-cascader placeholder="请选择所属部门" v-model="deptIds" :options="deptList" change-on-select @change="changeDeptValue" />
                        </a-form-item>
                      </a-col>
                      <a-col :span="9">
                        <a-form-item label="版本号" :label-col="{ span: 6 }" :wrapper-col="{ span: 10 }">
                          <a-input placeholder="请输入您的版本号" :maxLength="30" v-decorator="['version', { rules: [{ required: true, message: '请输入版本号' }] }]"></a-input>
                        </a-form-item>
                      </a-col>
                    </a-row>
                  </a-form-item>
                  <a-form-item label="接口说明" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                    <a-textarea placeholder="请输入接口说明" :maxLength="500" :autoSize="{ minRows: 2, maxRows: 6 }" style="height: 70px; max-height: 70px" v-decorator="['description']" />
                  </a-form-item>
                </div>
              </div>
              <!-- 参数定义 -->
              <div id="parameter" class="parameter-box base-box">
                <div class="title-box r-nw-fs-c">
                  <span class="line"></span>
                  <span class="title">参数定义</span>
                </div>
                <div class="info-box-content">
                  <a-tabs defaultActiveKey="1" @change="callback">
                    <a-tab-pane tab="查询params" key="1">
                      <a-table class="tabel-box" :columns="paramsHeaderColumns" :data-source="paramsData" :pagination="false" rowKey="key">
                        <template #number="{record}">{{ record.key }}</template>
                        <template #name="{record}">
                          <a-input v-model="record.name" />
                        </template>
                        <template #type="{record}">
                          <a-select v-decorator="['record.type']" :defaultValue="defaultType" v-model="record.typeValue" style="width: 100px">
                            <a-select-option v-for="(item, index) in record.type" :key="index" :value="item.key">{{ item.value }}</a-select-option>
                          </a-select>
                        </template>
                        <template #must="{record}">
                          <a-select v-decorator="['record.must']" :defaultValue="defaultMust" v-model="record.mustValue">
                            <a-select-option v-for="(item, index) in record.must" :key="index" :value="item.key">{{ item.value }}</a-select-option>
                          </a-select>
                        </template>
                        <template #default="{record}">
                          <a-input v-model="record.default" />
                        </template>
                        <template #note="{record}">
                          <a-input v-model="record.note" />
                        </template>
                        <template #handle="{record}">
                          <a-icon :style="{ color: '#0080FF', fontSize: '20px' }" type="delete" @click="deleteLine(text, record, 'param')" />
                        </template>
                      </a-table>
                      <div class="add-box r-nw-c-c">
                        <a-icon type="plus" />
                        <span class="add-text" @click="addLine('param')">添加</span>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane tab="请求headers" key="2">
                      <a-table class="tabel-box" :columns="paramsHeaderColumns" :data-source="headersData" :pagination="false" rowKey="key">
                        <template #number="{record}">{{ record.key }}</template>
                        <template #name="{record}">
                          <a-input v-model="record.name" />
                        </template>
                        <template #type="{record}">
                          <a-select v-decorator="['record.type']" :defaultValue="defaultType" v-model="record.typeValue">
                            <a-select-option v-for="item in record.type" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                          </a-select>
                        </template>
                        <template #must="{record}">
                          <a-select v-decorator="['record.must']" :defaultValue="defaultMust" v-model="record.mustValue" style="width: 100px">
                            <a-select-option v-for="(item, index) in record.must" :key="index" :value="item.key">{{ item.value }}</a-select-option>
                          </a-select>
                        </template>
                        <template #default="{record}">
                          <a-input v-model="record.default" />
                        </template>
                        <template #note="{record}">
                          <a-input v-model="record.note" />
                        </template>
                        <template #handle="{record}">
                          <a-icon :style="{ color: '#0080FF', fontSize: '20px' }" type="delete" @click="deleteLine(text, record, 'header')" />
                        </template>
                      </a-table>
                      <div class="add-box r-nw-c-c">
                        <a-icon type="plus" />
                        <span class="add-text" @click="addLine('header')">添加</span>
                      </div>
                    </a-tab-pane>
                    <a-tab-pane tab="请求bodys" key="3">
                      <a-radio-group defaultValue="raw" @change="selectedRadio">
                        <a-radio value="raw">raw</a-radio>
                        <a-radio value="form-data">form-data</a-radio>
                        <a-radio value="x-www-form-urlencoded">x-www-form-urlencoded</a-radio>
                      </a-radio-group>
                      <br />
                      <!-- <template #default="{record}">
                        <a-input v-model="record.default" />
                      </template> -->
                      <div class="base-radio c-fe-fe" v-show="radioValue === 'form-data'">
                        <div class="data-item r-nw-sb-c" v-for="(item, index) in formData" :key="index">
                          <div class="input-box">
                            <a-input placeholder="请输入参数名称" v-model="formData[index].fristValue" /> ：
                            <a-input placeholder="请输入参数值" v-model="formData[index].lastValue" />
                          </div>
                          <a-button class="form-btn" style="width: 110px" ghost type="danger" icon="minus" @click="deleteFormData(index)">删除</a-button>
                        </div>
                        <a-button class="add-btn" type="primary" icon="plus"  ghost @click="addFormData">添加参数</a-button>
                      </div>
                      <div class="base-radio c-fe-fe" v-show="radioValue === 'x-www-form-urlencoded'">
                        <div class="data-item r-nw-sb-c" v-for="(item, index) in formUrlencoded" :key="index">
                          <div class="input-box">
                            <a-input placeholder="请输入参数名称" v-model="formUrlencoded[index].fristValue" />
                            ：
                            <a-input placeholder="请输入参数值" v-model="formUrlencoded[index].lastValue" />
                          </div>
                          <a-button class="form-btn" style="width: 110px" ghost type="danger" icon="minus" @click="deleteFormUrlencoded(index)">删除</a-button>
                        </div>
                        <a-button class="add-btn" type="primary" icon="plus" ghost @click="addFormUrlencoded">添加参数</a-button>
                      </div>
                      <div class="base-radio" style="width" v-show="radioValue === 'raw'">
                        <a-select v-model="modelRaw" style="width: 200px; float: right; margin-top: -20px">
                          <a-select-option v-for="item in rawValues" :key="item.id" :value="item.value">{{ item.name }}</a-select-option>
                        </a-select>
                        <a-textarea :rows="10" style="width: 100%; margin-top: 10px" v-model="rawArea" />
                      </div>
                    </a-tab-pane>
                  </a-tabs>
                </div>
              </div>
              <!-- 返回结果 -->
              <div id="result" class="result-box base-box">
                <div class="title-box r-nw-fs-c">
                  <span class="line"></span>
                  <span class="title">返回结果</span>
                </div>
                <a-form-item label="返回类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" style="margintop: 51px">
                  <a-select style="width: 100%" placeholder="请选择返回类型" v-decorator="['innerResultType', { rules: [{ required: true, message: '请选择返回类型' }] }]">
                    <a-select-option v-for="item in resultType" :key="item.key" :value="item.key">{{ item.value }}</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item label="返回结果示例" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                  <a-textarea placeholder="请输入返回结果示例" :autoSize="{ minRows: 2, maxRows: 6 }" :rows="8" style="height: 70px; max-height: 70px" v-decorator="['successTemplate']" />
                </a-form-item>
                <a-form-item label="失败结果示例" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
                  <a-textarea placeholder="请输入失败结果示例" :autoSize="{ minRows: 2, maxRows: 6 }" style="height: 70px; max-height: 70px" v-decorator="['failedTemplate']" />
                </a-form-item>
              </div>
              <!-- 接口文档 -->
              <div id="interface" class="base-box" style="borderbottom: 1px solid transparent">
                <div class="title-box r-nw-fs-c">
                  <span class="line"></span>
                  <span class="title">接口文档</span>
                </div>
                <a-upload-dragger
                  name="file"
                  :multiple="true"
                  :action="action"
                  :beforeUpload="beforeUpload"
                  :fileList="fileList"
                  :headers="headers"
                  @change="handleChange"
                  v-decorator="['dragger', { valuePropName: 'filelist', getValueFromEvent: normFile }]"
                >
                  <p class="ant-upload-drag-icon">
                    <a-icon type="upload" />
                  </p>
                  <p class="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p class="ant-upload-hint">支持扩展名：.doc .docx .pdf .xls .xlsx…</p>
                </a-upload-dragger>
                <div class="tips" v-show="tipsShow">
                  <span class="close r-nw-fe-c" @click="tipsShow = !tipsShow">×</span>
                  <div class="r-nw-sa-c">
                    <a-icon type="exclamation-circle" style="font-size: 20px; color: #0080ff; padding-left: 20px" />
                    <div class="tips-content">
                      <h3>注意!</h3>
                      <p>1. 上传文件类型为'doc','docx','pdf','xls','xlsx'。</p>
                      <p>2. 最大上传文件大小为5M(5120kb)。</p>
                      <p>3. 支持拖动上传。</p>
                      <p>4. 如取消上传或删除文件点击该上传项'×'。</p>
                      <p>5. 请按照《省政务数据共享门户服务平台服务接口开发规范》中接口的标准模板并整理接口文档并上传。</p>
                    </div>
                  </div>
                </div>
              </div>
            </a-form-item>
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>
<script>
//import { validateVersion, validateUrl } from '@/utils/validate';
import serviceApi from '@/api/serviceApiBase';
//import departmentApi from '@/api/department';
//import storage from '@/utils/storage';
import { get } from 'js-cookie';
//import { setStorage } from '@/utils/storage';
import config from '@/config';
import { Form } from 'ant-design-vue';

const serverUrl = import.meta.env.MODE === 'development' ? '/api' : import.meta.env.VITE_APP_BASE_API;
const paramTyps = [
  { key: '0', value: '字节' },
  { key: '1', value: '字符' },
  { key: '2', value: '数字' },
  { key: '3', value: '布尔' },
  { key: '4', value: '浮点' },
  { key: '5', value: '文本' },
  { key: '6', value: '对象型' },
  { key: '7', value: '时间日期型' }
];
const defualtParamHeaderCol = {
  key: 1,
  name: '',
  type: paramTyps,
  must: [
    { key: '0', value: '是' },
    { key: '1', value: '否' }
  ],
  default: '',
  typeValue: '1',
  mustValue: '0',
  note: '',
  handle: ''
};
export default {
  name: 'serviceApiAdd',
  props: {
    visible: {
      type: Boolean
    },
    operation: {
      type: String
    },
    groupList: {
      type: Array,
      default: () => []
    },
    apiName:{
      type: String,
      default: ''
    }
  },
  data() {
    return {
      serviceApiId: '',
      // btnPerssion: BtnPermissions.register,
      spinning: false,
      headers: {
        Token: get(config.tokenKey)
      },
      action: serverUrl + serviceApi.uploadUrl,
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 12 }
      },
      //部门
      deptList: [],
      deptIds: [],
      // 服务协议
      serveHttp: [
        { key: '0', value: 'http' },
        { key: '1', value: 'https' }
      ],
      // 请求方式
      request: [
        { value: '1', name: 'GET' },
        { value: '2', name: 'HEAD' },
        { value: '3', name: 'POST' },
        { value: '4', name: 'PUT' },
        { value: '5', name: 'PATCH' },
        { value: '6', name: 'DELETE' },
        { value: '7', name: 'OPTIONS' },
        { value: '8', name: 'TRACE' }
      ],
      // raw选项值
      rawValues: [
        {
          id: '100',
          name: 'Text',
          value: 'text'
        },
        {
          id: '101',
          name: 'Text(text/plain)',
          value: 'text/plain'
        },
        {
          id: '102',
          name: 'JSON(application/json)',
          value: 'application/json'
        },
        {
          id: '103',
          name: 'Javascript(application/javascript)',
          value: 'application/javascript'
        },
        {
          id: '104',
          name: 'XML(application/xml)',
          value: 'application/xml'
        },
        {
          id: '105',
          name: 'XML(text/xml)',
          value: 'text/xml'
        },
        {
          id: '106',
          name: 'HTML(text/html)',
          value: 'text/html'
        }
      ],
      modelRaw: 'application/json',
      rawArea: '',
      // 返回类型
      resultType: [
        { key: '1', value: 'application/json;charset=UTF-8' },
        { key: '2', value: 'application/json' },
        { key: '3', value: 'text/html' },
        { key: '4', value: 'text/plain' },
        { key: '5', value: 'text/xml' },
        { key: '6', value: 'image/gif' },
        { key: '7', value: 'image/jpeg' },
        { key: '8', value: 'image/png' },
        { key: '9', value: 'application/xml' },
        { key: '10', value: 'application/pdf' },
        { key: '11', value: 'application/msword' },
        { key: '12', value: 'application/octet-stream' },
        { key: '13', value: 'multipart/form-data' }
      ],
      // 参数定义(查询params)
      paramsHeaderColumns: [
        {
          title: '序号',
          dataIndex: 'number',
          align: 'center',
          slots: {
            customRender: 'number'
          }
        },
        {
          title: '参数名',
          dataIndex: 'name',
          align: 'center',
          slots: {
            customRender: 'name'
          }
        },
        {
          title: '参数类型',
          dataIndex: 'type',
          align: 'center',
          slots: {
            customRender: 'type'
          }
        },
        {
          title: '是否必填',
          dataIndex: 'must',
          align: 'center',
          slots: {
            customRender: 'must'
          }
        },
        {
          title: '默认值',
          dataIndex: 'default',
          align: 'center',
          slots: {
            customRender: 'default'
          }
        },
        {
          title: '备注',
          dataIndex: 'note',
          align: 'center',
          slots: {
            customRender: 'note'
          }
        },
        {
          title: '操作',
          dataIndex: 'handle',
          align: 'center',
          slots: {
            customRender: 'handle'
          }
        }
      ],
      defaultType: '字节',
      defaultMust: '否',
      paramsData: [
        defualtParamHeaderCol
      ],
      headersData: [
        defualtParamHeaderCol
      ],
      // 参数定义(请求bodys)
      bodysColumns: [
        {
          title: '参数来源',
          dataIndex: 'origin',
          slots: {
            customRender: 'origin'
          }
        },
        {
          title: '参数名',
          dataIndex: 'name',
          slots: {
            customRender: 'name'
          }
        },
        {
          title: '参数值',
          dataIndex: 'value',
          slots: {
            customRender: 'value'
          }
        },
        {
          title: '操作',
          dataIndex: 'handle',
          width: '60px',
          slots: {
            customRender: 'handle'
          }
        }
      ],
      // 上传文档提示
      tipsShow: true,
      //上传变量
      loading: false,
      fileList: [],
      radioValue: 'raw',
      formData: [
        {
          fristValue: '',
          lastValue: ''
        }
      ],
      formUrlencoded: [
        {
          fristValue: '',
          lastValue: ''
        }
      ],
      key: '1',
      form: {}
    };
  },
  created() {
    //this.form = this.$form.createForm(this, { name: 'register' });
    this.form.paramsData = this.paramsData;
    this.form.headersData = this.headersData;
    this.form.formData = this.formData;
    this.form.formUrlencoded = this.formUrlencoded;
    this.getDepartmentData();
    //this.setRawValues();
  },
  methods: {
    // 获取部门数据
    getDepartmentData() {
      // departmentApi.allTree().then((res)=>{
      //   if(res){
      //     this.deptList = res;
      //   }
      // })
      this.deptList = [
        {
          children: [],
          code: '001',
          createUser: null,
          deptDesc: null,
          distType: 0,
          id: 'f33f25c8aa814d1eae51beabffc4d376',
          label: '甘肃省人民政府',
          logoPath: null,
          name: '甘肃省人民政府',
          nodeType: '3',
          orgCode: null,
          parentId: '',
          sort: null,
          spread: false,
          status: null,
          value: 'f33f25c8aa814d1eae51beabffc4d376'
        },
        {
          children: [
            {
              children: [],
              code: '001001006079',
              createUser: null,
              deptDesc: null,
              distType: 0,
              id: 'e173b5f124c54252a22b4423bd14682d',
              label: '甘南政务服务',
              logoPath: null,
              name: '甘南政务服务',
              nodeType: '3',
              orgCode: null,
              parentId: 'de11d5da207747a19575941f93e01bdb',
              sort: null,
              spread: false,
              status: null,
              value: 'e173b5f124c54252a22b4423bd14682d'
            }
          ],
          code: '001001006',
          createUser: null,
          deptDesc: null,
          distType: 0,
          id: 'de11d5da207747a19575941f93e01bdb',
          label: '甘肃政务服务',
          logoPath: null,
          name: '甘肃政务服务',
          nodeType: '3',
          orgCode: null,
          parentId: '',
          sort: null,
          spread: false,
          status: null,
          value: 'de11d5da207747a19575941f93e01bdb'
        }
      ];
    },
    //选择结构
    changeDeptValue(value) {
      console.log(value);
    },
    // 按钮权限控制
    // btnShow(name) {
    //   return hasPermission(name);
    // },
    //返回
    returnApiPage() {
      this.reset();
      this.$emit('hideView', 'false');
    },
    callback(key) {
      this.key = key;
    },
    // 删除参数
    deleteLine(text, record, type) {
      let key = record.key;
      const data = type == 'param'? this.paramsData: this.headersData;
      if (data.length > 1) {
        data.splice(key - 1, 1);
        for (let i = key - 1; i < data.length; i++) {
          data[i].key = i + 1;
        }
      }
    },
    // 增加参数
    addLine(type) {
      const data = type == 'param' ? this.paramsData: this.headersData;
      const obj = {
        key: data.length + 1,
        name: '',
        type: data[0].type,
        must: data[0].must,
        default: '',
        note: '',
        handle: '',
        typeValue: '1',
        mustValue: '0'
      };
      type == 'param' ? this.paramsData.push(obj) : this.headersData.push(obj);
    },
    // 改变radio值
    selectedRadio(e) {
      this.radioValue = e.target.value;
    },
    // 添加formData
    addFormData() {
      let obj = {
        fristValue: '',
        lastValue: ''
      };
      this.formData.push(obj);
    },
    // 删除formData
    deleteFormData(index) {
      if (this.formData.length > 1) {
        this.formData.splice(index, 1);
      }
    },
    // 添加urlencoded
    addFormUrlencoded() {
      let obj = {
        fristValue: '',
        lastValue: ''
      };
      this.formUrlencoded.push(obj);
    },
    // 删除urlencoded
    deleteFormUrlencoded(index) {
      if (this.formUrlencoded.length > 1) {
        this.formUrlencoded.splice(index, 1);
      }
    },
    // 上传接口文档
    beforeUpload(file) {
      const isJPG =
        file.type === 'application/msword' ||
        file.type === 'application/pdf' ||
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      if (!isJPG) {
        this.$message.error(`${file.name} 文件格式不正确`);
        this.loading = false;
        return false;
      } else {
        this.loading = true;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        this.$message.error(`${file.name} 文件太大了`);
        this.loading = false;
      } else {
        this.loading = true;
      }
      this.action = this.action + '?fileName=' + file.name;
    },
    normFile(e) {
      if (this.loading) {
        if (e.file.status === 'done') {
          if (!Array.isArray(e)) {
            if (e.file.response.code == 200 && e.file.response.data.uploadState) {
              this.$message.success(`${e.file.name}上传成功`);
              return e && e.fileList;
            } else {
              this.$message.success(`${e.file.name}上传失败`);
            }
          }
        }
      } else {
        e.fileList.splice(e.fileList.length - 1, 1);
      }
    },
    handleChange(info) {
      const { file, fileList } = info;
      this.fileList = fileList.filter((item) => {
        return (
          item.size / 1024 / 1024 < 5 &&
          (item.name !== file.name || file.uid === item.uid) &&
          (item.type === 'application/msword' ||
            item.type === 'application/pdf' ||
            item.type === 'application/vnd.ms-excel' ||
            item.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            item.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        );
      });
    },

    reset() {
      //重置表单
      this.form.resetFields();
      this.deptIds = [];
      //重置参数
      //let typeParam = this.paramsData.length ? this.paramsData[0].type : '0';
      this.paramsData = [
        defualtParamHeaderCol
      ];
      //let typeHeader = this.headersData.length ? this.headersData[0].type : '0';
      this.headersData = [
        defualtParamHeaderCol
      ];
      this.formData = [
        {
          fristValue: '',
          lastValue: ''
        }
      ];
      this.formUrlencoded = [
        {
          fristValue: '',
          lastValue: ''
        }
      ];
      this.rawArea = '';
      this.fileList = [];
      this.modelRaw = 'application/json';
    },

    // 重置数据
    confirm(e) {
      e.preventDefault();
      this.reset();
    },
    // 注册
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.saveData(values);
          //     let params = {
          //       field: 'name',
          //       value: values.name
          //     };
          //     serviceApi.validate(params).then((data) => {
          //       if (data.code === 200 && data.data) {
          //         // 表示后台存在数据
          //         this.$message.error('接口名称已存在');
          //         this.spinning = false;
          //         return;
          //       }
          //       params = {
          //         field: 'inner_url',
          //         value: values.innerUrl
          //       };
          //       this.spinning = true;
          //       serviceApi.validate(params).then((data) => {
          //         if (data.code === 200 && data.data) {
          //           // 表示后台存在数据
          //           this.$message.error('接口URL已存在');
          //           this.spinning = false;
          //           return;
          //         }
          //         values.params = [];
          //         // if (this.key === "1") {
          //         for (let i = 0; i < this.paramsData.length; i++) {
          //           if (this.paramsData[i].name !== undefined && this.paramsData[i].name.trim() !== '') {
          //             values.params.push({
          //               name: this.paramsData[i].name,
          //               type: this.paramsData[i].typeValue,
          //               index: i + 1,
          //               required: this.paramsData[i].mustValue,
          //               defaultValue: this.paramsData[i].default,
          //               description: this.paramsData[i].note,
          //               location: '1'
          //             });
          //           }
          //         }
          //         // }
          //         // if (this.key === "2") {
          //         for (let i = 0; i < this.headersData.length; i++) {
          //           if (this.headersData[i].name !== undefined && this.headersData[i].name.trim() !== '') {
          //             values.params.push({
          //               name: this.headersData[i].name,
          //               type: this.headersData[i].typeValue,
          //               index: i + 1,
          //               required: this.headersData[i].mustValue,
          //               defaultValue: this.headersData[i].default,
          //               description: this.headersData[i].note,
          //               location: '2'
          //             });
          //           }
          //         }

          //         for (let i = 0; i < this.formData.length; i++) {
          //           if (this.formData[i].fristValue !== undefined && this.formData[i].fristValue.trim() !== '' && this.formData[i].lastValue !== undefined && this.formData[i].lastValue.trim() !== '') {
          //             values.params.push({
          //               name: this.formData[i].fristValue,
          //               type: '100',
          //               index: i + 1,
          //               required: '0',
          //               defaultValue: this.formData[i].lastValue,
          //               description: '',
          //               location: '3'
          //             });
          //           }
          //         }
          //         for (let i = 0; i < this.formUrlencoded.length; i++) {
          //           if (
          //             this.formUrlencoded[i].fristValue !== undefined &&
          //             this.formUrlencoded[i].fristValue.trim() !== '' &&
          //             this.formUrlencoded[i].lastValue !== undefined &&
          //             this.formUrlencoded[i].lastValue.trim() !== ''
          //           ) {
          //             values.params.push({
          //               name: this.formUrlencoded[i].fristValue,
          //               type: '101',
          //               index: i + 1,
          //               required: '0',
          //               defaultValue: this.formUrlencoded[i].lastValue,
          //               description: '',
          //               location: '3'
          //             });
          //           }
          //         }
          //         if (this.rawArea !== undefined && this.rawArea.trim() !== '') {
          //           values.params.push({
          //             name: this.modelRaw,
          //             type: '102',
          //             index: 1,
          //             required: '0',
          //             defaultValue: this.rawArea,
          //             description: '',
          //             location: '3'
          //           });
          //         }
          //         values.fileIds = '';
          //         if (this.fileList !== undefined && this.fileList.length > 0) {
          //           for (let i = 0; i < this.fileList.length; i++) {
          //             if (this.fileList[i].response.code === 200) {
          //               if (i + 1 === this.fileList.length) {
          //                 values.fileIds += this.fileList[i].response.data.fileId;
          //               } else {
          //                 values.fileIds += this.fileList[i].response.data.fileId + ',';
          //               }
          //             }
          //           }
          //         }
          //         this.spinning = true;
          //         serviceApi.addServerApi(values).then((data) => {
          //           this.spinning = false;
          //           if (data.code === 200 && data.data) {
          //             this.$message.success('接口注册成功');
          //             this.spinning = false;
          //             this.reset();
          //           } else {
          //             this.$message.error('接口注册失败');
          //             this.spinning = false;
          //           }
          //         });
          //       });
          //     });
        }
      });
    },
    saveData(values) {
      values.params = [];
      // if (this.key === "1") {
      for (let i = 0; i < this.paramsData.length; i++) {
        if (this.paramsData[i].name !== undefined && this.paramsData[i].name.trim() !== '') {
          values.params.push({
            name: this.paramsData[i].name,
            typeValue: this.paramsData[i].typeValue,
            index: i + 1,
            mustValue: this.paramsData[i].mustValue,
            default: this.paramsData[i].default,
            note: this.paramsData[i].note,
            location: '1'
          });
        }
      }
      // }
      // if (this.key === "2") {
      for (let i = 0; i < this.headersData.length; i++) {
        if (this.headersData[i].name !== undefined && this.headersData[i].name.trim() !== '') {
          values.params.push({
            name: this.headersData[i].name,
            typeValue: this.headersData[i].typeValue,
            index: i + 1,
            mustValue: this.headersData[i].mustValue,
            default: this.headersData[i].default,
            note: this.headersData[i].note,
            location: '2'
          });
        }
      }

      for (let i = 0; i < this.formData.length; i++) {
        if (this.formData[i].fristValue !== undefined && this.formData[i].fristValue.trim() !== '' && this.formData[i].lastValue !== undefined && this.formData[i].lastValue.trim() !== '') {
          values.params.push({
            fristValue: this.formData[i].fristValue,
            type: '100',
            index: i + 1,
            required: '0',
            lastValue: this.formData[i].lastValue,
            description: '',
            location: '3'
          });
        }
      }
      for (let i = 0; i < this.formUrlencoded.length; i++) {
        if (
          this.formUrlencoded[i].fristValue !== undefined &&
          this.formUrlencoded[i].fristValue.trim() !== '' &&
          this.formUrlencoded[i].lastValue !== undefined &&
          this.formUrlencoded[i].lastValue.trim() !== ''
        ) {
          values.params.push({
            fristValue: this.formUrlencoded[i].fristValue,
            type: '101',
            index: i + 1,
            required: '0',
            lastValue: this.formUrlencoded[i].lastValue,
            description: '',
            location: '3'
          });
        }
      }
      if (this.rawArea !== undefined && this.rawArea.trim() !== '') {
        values.params.push({
          name: this.modelRaw,
          type: '102',
          index: 1,
          required: '0',
          defaultValue: this.rawArea,
          description: '',
          location: '3'
        });
      }
      values.fileIds = '';
      if (this.fileList !== undefined && this.fileList.length > 0) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].response.code === 200) {
            if (i + 1 === this.fileList.length) {
              values.fileIds += this.fileList[i].response.data.fileId;
            } else {
              values.fileIds += this.fileList[i].response.data.fileId + ',';
            }
          }
        }
      }
      values.deptIds = this.deptIds;
      values.id = this.serviceApiId;
      this.spinning = true;
      this.$emit('saveToTable', values);
      this.$message.success('操作成功');
      this.spinning = false;
      this.reset();

      this.returnApiPage();
    },
    setParamsVal(params){
      if (params !== null && params.length > 0) {
        this.paramsData = params.filter((item) => item.location === '1');
        this.paramsData.map((e) => {
          e.type = paramTyps;
          e.must = [
            { key: '0', value: '是' },
            { key: '1', value: '否' }
          ];
        });
        this.headersData = params.filter((item) => item.location === '2');
        this.headersData.map((e) => {
          e.type = paramTyps;
          e.must = [
            { key: '0', value: '是' },
            { key: '1', value: '否' }
          ];
        });
        this.formData = params.filter((item) => item.type === '100');
        this.formUrlencoded = params.filter((item) => item.type === '101');
        let list = params.filter((item) => item.type === '102');
        this.rawArea = list[0] ? list[0].defaultValue : '';
        this.modelRaw = list[0] ? list[0].name : '';
      }
    },
    setFormData(row) {
      this.serviceApiId = row.id;
      const params = row.params;
      const data = row;
      //设置参数内容
      this.setParamsVal(params);
      //设置表单内容
      this.deptIds = data.deptIds;
      const formItemArr = [
        'name',
        'openPath',
        'serviceAgreement',
        'innerAgreement',
        'innerMethod',
        'concurrency',
        'groupNo',
        'version',
        'deptIds',
        'description',
        'innerResultType',
        'successTemplate',
        'failedTemplate'
      ];
      formItemArr.forEach(e =>{
        this.form.getFieldDecorator(e, { initialValue: data[e] });
      });
      //设置文件内容
      if (data.files) {
        let fileList = [];
        for (let i = 0; i < data.files.length; i++) {
          fileList.push({
            uid: data.files[i].id,
            name: data.files[i].beforeFileName,
            status: 'done',
            url: '/api/file/download/' + data.files[i].id,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 123
          });
        }
        this.fileList = fileList;
        //this.headers.Token = sessionStorage.getItem(constants.tokenKey);
        this.headers.Token = get(config.tokenKey);
      }
    }
  }
};
</script>
<style lang="less" scoped>
::-webkit-scrollbar {
  width: 0 !important;
}

.container {
  background: #fff;
  border-radius: 3px;
  .btn-box {
    margin: 0 auto;
    width: 98%;
    height: 60px;
    //border-bottom: 1px solid #e1e4ec;
    display: block;
    border-radius: 3px;
    position: relative;
    .service-sign-in {
      display: flex;
      display: -webkit-flex;
      justify-content: space-between;
      position: relative;
      top: 15px;
      > div:first-child {
        font-size: 20px;
        margin-left: 47px;
      }
    }
    .btn-reset {
      margin: 0 10px !important;
    }
  }

  .left {
    width: 15%;
    max-width: 175px;
    &:deep(.ant-anchor-wrapper) {
      margin-left: 0;
    }
    &:deep(.ant-anchor) {
      width: 50%;
      margin: 50px auto 0;
    }
    &:deep(.ant-anchor-link a) {
      font-size: 14px;
    }
  }

  .right {
    flex: 1;
    padding-bottom: 80px;
    border-left: 1px solid #d7dce6;
  }

  .base-box {
    width: 100%;
    padding: 50px;
    border-bottom: 1px solid #e1e4ec;
    .title-box {
      .line {
        display: block;
        width: 3px;
        height: 15px;
        background-color: #0080ff;
      }

      .title {
        margin-left: 15px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 1);
        line-height: 22px;
        letter-spacing: 1px;
      }
    }
    .base-info-box {
      padding-left: 53px;
    }
    .param-define-box {
      padding-left: 70px;
      .tabel-box {
        width: 100%;
      }
    }
    .info-box-content {
      margin-top: 30px;
    }
  }

  // 参数定义
  .parameter-box {
    &:deep(.ant-table table) {
      width: 100%;
      border: 1px solid #e7ecf3;
    }

    &:deep(.ant-table-placeholder) {
      width: 100%;
    }

    &:deep(.ant-empty) {
      display: none;
    }

    .add-box {
      width: 100%;
      height: 45px;
      color: #0080ff;
      font-size: 14px;
      border: 1px solid #e7ecf3;
      border-top: 0;

      .add-text {
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .base-radio {
      width: 65%;

      .data-item {
        width: 100%;
        margin: 10px 0;

        .input-box {
          width: 80%;

          input {
            line-height: 30px;
            width: 45%;
          }
        }
      }
    }
  }
  &:deep(.row-item-box .ant-col-12) {
    width: 100%;
  }
  // 接口文档
  &:deep(.ant-upload-drag) {
    margin: 31px 0 0 8%;
    width: 672px;
    height: 270px;
    background-color: #fff;
  }
  &:deep(.ant-upload-list) {
    width: 672px;
    margin-left: 8%;
  }
  &:deep(.ant-form-item) {
    margin-bottom: 10px;
  }
  .tips {
    background-color: #eff9ff;
    border: 1px solid #0080ff;
    border-radius: 5px;
    width: 672px;
    margin: 31px 0 0 8%;
    padding: 10px 0;
    color: #404040;

    .close {
      line-height: 20px;
      margin-right: 10px;
      cursor: pointer;
      font-size: 20px;
    }

    /*padding: 10px 0;*/

    h3,
    p {
      padding: 0;
      margin: 0;
      line-height: 25px;
    }
    .tips-content {
      font-size: 12px;
    }
  }
}
</style>
