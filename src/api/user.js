import { get } from '../utils/request';
const prefix = '/user';
export default {
  list: () => get(`${prefix}/`),
  getInfo: () => get(`${prefix}/info`)
};
