# 数据MOCK
为了让前端更快的投入开发，在后端接口出来前，前端就需要进行数据mock，等接口出来后再进行联调。
数据Mock一般有如下几种方式：

- 使用在线mock服务，如[Easy-mock](https://www.easy-mock.com/)、[Yapi](https://hellosean1025.github.io/yapi/)、[Apizza](https://apizza.net/pro/#/)。
- 基于[json-server](https://github.com/typicode/json-server)提供本地服务。
- 请求拦截，基于[MockJs](http://mockjs.com/)创建本地mock服务。

为了方便，这里采用第三种方式，不过由于单纯使用`mockjs`不会发送真实的请求，导致调试不方便，所以这里使用[mocker-api](https://github.com/jaywcjlove/mocker-api#readme),利用webpack-dev-server的before钩子来做数据mock。

实现了如下功能：

- mock的文件更新，会自动重载
- 支持接收请求参数，动态处理返回数据
- 可以使用mockjs语法


![image-20200929101710060](https://gitee.com/letwrong/Picture/raw/master/20200929101710.png)

```js
// webpack.config.js
const apiMocker = require('mocker-api');

module.exports = {
    // ...
    devServer: {
        before(app) {
          apiMocker(app, resolve('./mock/index.js'));
        }
    }
}
```

在mock目录中，`index.js`用来做文件自动载入，而其他文件则为模拟数据，每个功能模块可以分割为一个文件，模块化管理。

*提示：mock的这些文件是在webpack中使用的，即在node环境下，需要遵循commonjs规范。*

```js
// ./mock/_mockProdServer.js
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// Import your mock .ts files one by one
// If you use vite.mock.config.ts, just import the file directly

const modules = import.meta.globEager('./**/*.js');

const mockModules = [];
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return;
  }
  mockModules.push(...modules[key]);
});


export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
```

```js
// ./mock/auth.js
const menus =  { // 如果仅直接返回数据，而不需接收参数做逻辑处理，直接返回数据即可
    code: 0,
    msg: '登录成功',
    data: [
      // ...
    ]
};
const login = ({ body }) => { // 如果需要接收参数来进行逻辑处理，可以写成函数，参数为请求req
    // 根据参数做验证
    return {
      code: 0,
      msg: '登录成功',
      data: {
        username: body.username,
        token: '@guid',
        refresh_token: '@guid',
        expires_in: 100000,
        sex: 1,
        role: body.role
      }
    };
};

module.exports = [{
  url: '/api/auth/login',
  method: 'post',
  response: login
},{
  url: '/api/auth/menus',
  response: menus
}];
```
在`package.json`的script中定义了mock环境的启动脚本`"serve:mock": "vite dev --mode mock"`，在终端执行`npm run serve:mock`即可启动mock环境。