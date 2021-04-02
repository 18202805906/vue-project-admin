import { get, post } from '../utils/request';
const prefix = '/uc/department';
export default {
    //获取接口树
    allTree: () => get(`${prefix}/allTree`),
}