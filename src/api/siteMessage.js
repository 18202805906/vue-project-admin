import { get, post } from '../utils/request';
export default {
    typeList: () => get('/siteMessage/typeList'),
    messageList: (params) => post('/siteMessage/messageList',params),
}