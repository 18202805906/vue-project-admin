const { resolve } = require('path');
const webpack = require('webpack');
const mockServer = require('@bwrong/mock');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { appTitle, modifyVars, appVersion } = require('./src/config');
const { VUE_APP_API_ROOT, VUE_APP_API_HOST } = process.env;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_MOCK = process.env.NODE_ENV === 'mock';
const productionGzipExtensions = ['js', 'css', 'html', 'svg'];
const ENABLE_CDN = false; // 开启cdn
// cdn配置
const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    nprogress: 'NProgress',
    // clipboard: 'ClipboardJS',
    // '@antv/data-set': 'DataSet',
    'js-cookie': 'Cookies'
  },
  css: [],
  js: [
    '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
    '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
    '//cdn.jsdelivr.net/npm/vuex@3.4.0/dist/vuex.min.js',
    '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
    '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
    // '//cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
    // '//cdn.jsdelivr.net/npm/@antv/data-set@0.11.4/build/data-set.min.js',
    '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js'
  ]
};
module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 8080,
    before(app) {
      IS_MOCK && mockServer(app, resolve('./mock/'), {
        prefix: VUE_APP_API_ROOT
      });
    },
    proxy: {
      [VUE_APP_API_ROOT]: {
        target: VUE_APP_API_HOST, // 你接口的域名
        // secure: false,
        // ws: true,
        // changeOrigin: true,
        pathRewrite: {
          [`^${VUE_APP_API_ROOT}`]: '/api' // 需要rewrite的,即真实的服务器地址中是否包含api_root
        }
      }
    },
  },
  configureWebpack: (config) => {
    config.plugins.push(
      // 去掉moment多余语言文件
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    );
    if (IS_PRODUCTION) {
      config.plugins.push(
        // 开启gzip压缩
        new CompressionWebpackPlugin({
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

  chainWebpack: (config) => {
    // 添加文件路径别名
    config.resolve.alias.set('components', resolve('src/components'));
    // 优化js压缩
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.compress.drop_console = true;
      args[0].terserOptions.compress.drop_debugger = true;
      return args;
    });
    config.plugin('html').tap((args) => {
      // 修改title
      args[0].title = appTitle;
      if (IS_PRODUCTION) {
        // 注入版本信息
        const GitRevision = new GitRevisionPlugin();
        args[0].appVersion = `
          app-version=${appVersion},
          git-hash=${GitRevision.version()},
          git-branch=${GitRevision.branch()},
          build-date=${new Date().toLocaleString()}
        `;
        // cdn
        ENABLE_CDN && (args[0].cdn = assetsCDN);
      }
      return args;
    });
    // 分包
    config.when(process.env.NODE_ENV !== 'development', (config) => {
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            name: 'chunk-vendor',
            test: /[\\/]node_modules[\\/]/,
            priority: 10, // 优先级
            chunks: 'initial'
          },
          antd: {
            name: 'chunk-antd',
            test: /[\\/]node_modules[\\/]_?(ant-design-vue|@ant-design)(.*)/,
            priority: 20
          },
          components: {
            name: 'chunk-components',
            test: resolve('src/components'),
            minChunks: 3,
            priority: 5,
            reuseExistingChunk: true
          }
        }
      });
      config.optimization.runtimeChunk('single');
      // config.optimization.mergeDuplicateChunks=false;
    });
  },
  css: {
    sourceMap: !IS_PRODUCTION,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
          modifyVars
        }
      },
      sass: {
        additionalData: `
          @import "@/assets/style/_variable.scss";
          @import "@/assets/style/_mixin.scss";
        `
      }
    }
  }
};
