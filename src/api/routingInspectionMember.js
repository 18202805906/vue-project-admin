import { get, post } from '../utils/request';
const prefix = '/uc/routingInspectionMember';
export default {
  serviceApiExistInMembers: (params) => get(`${prefix}/serviceApiExistInMembers`, params),

};
