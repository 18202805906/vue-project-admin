import { get, post } from '../utils/request';
const prefix = '/uc/serviceApi';
export default {
  queryForPage: (params) => get(`${prefix}/queryForPage`, params),
  apiCombinationConfig: () => post(`${prefix}/apiCombinationConfig`),
  //跳转到服务编排的地址
  toApiCombination: '/uc/apiCombination/toApiCombination',
  //查询草稿箱
  trashPage: (params) => get(`${prefix}/delPage`, params),
  //草稿箱恢复数据
  reBackDelInfo: (id) => post(`${prefix}/reBackDelInfo?id=${id}`),
  //删除草稿箱
  deleteForever: (id) => post(`${prefix}/deleteServerInfo?id=${id}`),

  validateOpenPath:(params) => get(`${prefix}/validateOpenPath`, params),
  //删除api
  delete:(id)=> post(`${prefix}/deleteServerApi?id=${id}`),
  //获取分组
  groupAll:() => get(`${prefix}/groupAll`),
  //文件上传地址
  uploadUrl: '/uc/tFileInfo/upload',
  //保存
  addServerApi: (params) => post(`${prefix}/addServerApi`, params),


};
