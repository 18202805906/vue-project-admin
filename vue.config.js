const { resolve } = require('path');
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_MOCK = process.env.NODE_ENV === 'mock';
const openInEditor = require('launch-editor-middleware');
const mockServer = require('@bwrong/mock');
const pkg = require('../../package');
const { VUE_APP_API_HOST, VUE_APP_API_TITLE, VUE_APP_API_PREFIX } = process.env;
// const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'html', 'svg'];
//const { appTitle, appVersion } = require('./src/config');
const ENABLE_CDN = false; // 开启cdn

const assetsCDN = {
  // webpack build externals 外部依赖
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    nprogress: 'NProgress',
    'js-cookie': 'Cookies'
  },
  css: [],
  js: [
    '//cdn.jsdelivr.net/npm/vue@3.0.7/dist/vue.runtime.global.prod.js',
    '//cdn.jsdelivr.net/npm/vue-router@4.0.4/dist/vue-router.global.prod.js',
    '//cdn.jsdelivr.net/npm/vuex@4.0.0/dist/vuex.global.prod.js',
    '//cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
    '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js'
  ]
};


module.exports = {
    publicPath: '/', //部署应用包时的基本 URL,默认值是'/'
    outputDir: 'dist', //默认是dist,打包的输出路径
    assetsDir: 'static', //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    indexPath: 'index.html', //指定生成html文件的输出路径 (相对于 outputDir)
    //lintOnSave: 'default', //是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码,Type: boolean | 'warning' | 'default' | 'error'
    //filenameHashing: 'true', //默认是true，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存
    productionSourceMap: false,  //如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建,默认是true
    devServer: {
      open: true, //设置启动项目时，是否在网页打开
      port: 8080,
      before(app) {
        // 支持在vue-dev-tools中打开组件?
        app.use('/__open-in-editor', openInEditor());
        // 数据mock
        IS_MOCK &&
          mockServer(app, resolve('./mock/'), {
            prefix: VUE_APP_API_PREFIX,
            delay: 500
          });
      },
      proxy: {
        [VUE_APP_API_PREFIX]: {
          target: VUE_APP_API_HOST, // 你接口的域名
          // secure: false,
          // ws: true,
          // changeOrigin: true,
          pathRewrite: {
            [`^${VUE_APP_API_PREFIX}`]: '/api' // 需要rewrite的,即真实的服务器地址中是否包含api_root
          }
        }
      }
    },
    //Type: Object | Function,可以是对象||函数，对象直接通过webpack-merge进行合并到webpack，函数进行解析拆分为参数后进行合并
    //主要用于修改webpack的参数配置
    configureWebpack:(config)=>{
      // config.plugins.push(
      //   // dayjs替换moment
      //   new AntdDayjsWebpackPlugin({ preset: 'antdv3' })
      // );
      if (IS_PRODUCTION) {
        config.plugins.push(
          // gzip
          new CompressionWebpackPlugin({
            // 开启gzip压缩
            filename: '[file].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
            threshold: 10240,
            minRatio: 0.8,
            compressionOptions: { level: 1 }
          })
        );
        // cdn
        ENABLE_CDN && (config.externals = assetsCDN.externals);
      }

    },
    //configureWebpack 和 chainWebpack 的作用相同
    //区别在于：chainWebpack 通过链式编程的形式，configureWebpack 通过操作对象的形式
    //允许对内部的 webpack 配置进行更细粒度的修改。Type: Function
    chainWebpack: (config) => {
      // 优化js压缩
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions.compress.drop_console = true;
        args[0].terserOptions.compress.drop_debugger = true;
        return args;
      });

      //因为 index 文件被用作模板，所以你可以使用 lodash template 语法插入内容：
      config.plugin('html').tap((args) => { //修改index.html中的信息
        // 修改title
        args[0].title = VUE_APP_API_TITLE; //修改html模板title
        if (IS_PRODUCTION) { //修改html模板的版本号
          // 注入版本信息
          const GitRevision = new GitRevisionPlugin();
          args[0].appVersion = `
            app-version=${pkg.version},
            git-hash=${GitRevision.version()},
            git-branch=${GitRevision.branch()},
            build-date=${new Date().toLocaleString()}
          `;
          // cdn
          ENABLE_CDN && (args[0].cdn = assetsCDN);
        }
        return args;
      });
    },
    css: {
        //requireModuleExtension： true //css模块化,默认是true
        extract: IS_PRODUCTION, //Default: 生产环境下是 true，开发环境下是 false,是否将组件中的 CSS 提取至一个独立的 CSS 文件中 
        sourceMap: !IS_PRODUCTION, //是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
        loaderOptions: { //向 CSS 相关的 loader 传递选项。
          less: {
            additionalData: '@import "@/assets/style/_mixin.less";',
            lessOptions: {
              javascriptEnabled: true,
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
              }
            }
          }
        }
      }

}