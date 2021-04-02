const typeList = {
  code: 200,
  msg: '请求成功',
  body: [
    { value: '系统消息', key: 'SYSTEM' },
    { value: '其它', key: 'OTHER' },
    { value: '网关服务预警消息', key: 'SERVICE_WARNING' },
    { value: '网关并发预警消息', key: 'CURRENT_WARNING' }
  ]
};

const messageList = ({ body }) => {
  return {
    code: 200,
    msg: '',
    body: {
      current: 1,
      pages: 6,
      records: [
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 218726,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 0,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 21846,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 1,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 21376,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 1,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 23876,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 0,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 12876,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 1,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 21836,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 0,
          type: 'SERVICE_WARNING'
        },
        {
          content: '该节点-10.18.101.210,注意内存已超出预警阀值,目前：98%,',
          createTime: '2020-12-10 09:35:24',
          id: 21876,
          receiver: 'admin',
          sender: 'SYSTEM',
          state: 0,
          type: 'SERVICE_WARNING'
        }
      ],
      searchCount: true,
      size: 10,
      total: 30
    }
  };
};

module.exports = [
  {
    url: '/siteMessage/typeList',
    response: typeList
  },
  {
    url: '/siteMessage/messageList',
    method: 'post',
    response: messageList
  }
];
