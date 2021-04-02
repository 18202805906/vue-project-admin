const list = ({ body }) => {
  return {
    code: 200,
    msg: '',
    body: {
      total: 200,
      current: Number(body.page),
      size: Number(body.size),
      'records|10': [
        {
          id: '@guid',
          content: '节点-xxxxxx, 内存已超出预警阀值, 目前：@integer(90,100)%。',
          sender: '@cname',
          state: '@pick(0,1)',
          createTime: '@datetime(yyyy-MM-dd HH:mm:ss)',
          type: '@pick(WARNING,SYSTEM,OTHER)'
        }
      ]
    }
  };
};

module.exports = [
  {
    url: '/api/system/messageList',
    method: 'post',
    response: list
  }
];
