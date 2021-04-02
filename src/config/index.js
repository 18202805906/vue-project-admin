const env = process.env;
const IS_PRODUCTION = env.NODE_ENV === 'production';
const baseUrl = IS_PRODUCTION ? env.VUE_APP_API_HOST : env.VUE_APP_API_ROOT;
const pkg = require('../../package');
const baseConfig = {
  appTitle: 'vue2+antd后台管理系统', // 应用名称，用于显示在浏览器标签
  appVersion: pkg.version,
  cryptoKey: '', // 密码加密使用的盐
  baseUrl
};
// token相关配置
const tokenConfig = {
  tokenKey: 'token', // token在cookie中的key
  refreshTokenKey: 'refresh_token', // 刷新token在cookie中的key
  tokenExpiresKey: 'token_expires', // token过期时间在cookie中的key
  refreshAheadTime: 1800000 // 在token过期时间前提前多久更新token
};
// 路由相关配置
const routerConfig = {
  homePage: '/home', // 登入应用默认的页面
  routerBase: '', // 路由前缀
  routerMode: 'history', // 路由模式
  whiteRoutes: ['/login', '/err'] // 路由白名单
};
// 样式相关配置
const styleConfig = {
  theme: 'light',
  lang: 'zh_CN',
  modifyVars: {
    '@primary-color': '#1890ff', // 全局主色
    '@link-color': '#1890ff', // 链接色
    '@success-color': '#52c41a', // 成功色
    '@warning-color': '#faad14', // 警告色
    '@error-color': '#FF4D4F', // 错误色
    '@font-size-base': '14px', // 主字号
    '@heading-color': 'rgba(0, 0, 0, 0.85)', // 标题色
    '@text-color': 'rgba(0, 0, 0, 0.65)', // 主文本色
    '@text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
    '@disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
    '@border-radius-base': '4px', // 组件/浮层圆角
    '@border-color-base': '#d9d9d9', // 边框色
    '@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // 浮层阴影
    '@btn-border-radius-base': '2px',
    '@btn-border-radius-sm': '2px',
    '@breadcrumb-link-color': '#333',
    '@breadcrumb-last-item-color': '@primary-color',
    '@layout-header-background': '@primary-color'
  },
  pagination: {
    showSizeChanger: false,
    showQuickJumper: true,
    size: 'large',
    current: 1,
    pageSize: 10,
    total: 0
  }
};
// 需要以commonjs形式导出，因为在webpack配置中也要用到此配置
module.exports = {
  ...baseConfig,
  ...tokenConfig,
  ...routerConfig,
  ...styleConfig
};
