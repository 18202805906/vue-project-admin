import { get } from '../utils/request';
const prefix = '/uc/serviceApiType';
export default {
  //所有接口类型查询
  all: () => get(`${prefix}/all`)
};
