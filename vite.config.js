import { defineConfig, loadEnv  } from 'vite';
import {resolve} from 'path';
import vue from '@vitejs/plugin-vue'
import { injectHtml,minifyHtml } from 'vite-plugin-html';
import pkg from './package.json';
import { buildConfig } from './build/buildConfig';
import { wrapperEnv } from './build/utils';
import viteCompression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { viteMockServe } from 'vite-plugin-mock';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const IS_MOCK = process.env.NODE_ENV === 'mock';
const ENABLE_CDN = false;

// https://vitejs.dev/config/
export default ({ command, mode }) => {
  //导出变量
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_APP_API_HOST, VITE_APP_API_TITLE, VITE_APP_API_PREFIX } = viteEnv;
  //定义cdn
  const assetsCDN = {
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

  //设置html模板内容
  const htmlConfig = () =>{
    let appVersion = '';
    let cdn = [];
    if (IS_PRODUCTION) { //修改html模板的版本号
      // 注入版本信息 (暂时未找到vite用的插件)
      //const GitRevision = new GitRevisionPlugin();
      // appVersion = `
      //   app-version=${pkg.version},
      //   git-hash=${GitRevision.version()},
      //   git-branch=${GitRevision.branch()},
      //   build-date=${new Date().toLocaleString()}
      // `;
      appVersion = `
        app-version=${pkg.version},
        build-date=${new Date().toLocaleString()}
      `;
      // cdn
      ENABLE_CDN && (cdn = assetsCDN);
    }
    return {
      appVersion,
      title: VITE_APP_API_TITLE,
      cdn
    }
  }
  return {
    // 入口
    entry: 'index.html',
    // 打包后的跟路径
    base:'/',
    //Vite 默认的静态目录是 public,publicDir 参数，将静态目录修改为你需要的目录
    publicDir: 'static',
    // 是否开启ssr服务断渲染
    ssr: false,
    //由于 Vite 本身已经用了 @ 去做模块导入工作，如果用 @ 别名当绝对路径去使用会有问题,
    resolve:{
      alias: {
        '@': resolve(__dirname, './src'),
        'components': resolve(__dirname, './src/components')
      }
    },
    //调整控制台输出的级别，默认为 'info', 'info' | 'warn' | 'error' | 'silent'
    //logLeve:info,
    //引用插件
    plugins: [
      vue(),
      //html配置
      minifyHtml(),
      injectHtml({
        injectData: {
          ...htmlConfig()
        }
      }),
      vueJsx({
        transformOn: false, // 把 on: { click: xx } 转成 onClick: xxx
        optimize: false // 优化
      }),
      //生产环境生成 .gz 文件
      viteCompression({
        //是否在控制台输出压缩结果
        verbose: true,
        //是否禁用
        disable: false,
        //体积大于 threshold 才会被压缩,单位 b
        threshold: 10240,
        //压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
        algorithm: 'gzip',
        //生成的压缩包后缀
        ext: '.gz'
      }),
      //处理兼容性
      legacy({
        targets: ['defaults', 'not IE 10']
      }),
      //mock数据
      viteMockServe({
        ignore: /^\_/,
        // default的mock路径
        mockPath: 'mock',
        //监听文件
        watchFiles:true,
        //适配ts,默认开启
        supportTs: false,
        //启动本地mock模式时，使用的环境变量
        localEnabled: mode === 'mock',
        //生产环境使用mock
        prodEnabled:false,
        //在console中展示请求日志
        logger: true,
        //mock的配置文件,默认  vite.mock.config.ts
        //configPath: vite.mock.config.ts
        //用于的mock数据
        injectCode: `
            import { setupProdMockServer } from './mock/_mockProdServer';
            setupProdMockServer();
            `,
      }),
    ],
    build: buildConfig,
    server: {
      //设置启动项目时，是否在网页打开
      open: true,
      //指定服务器主机名
      //host: '0.0.0.0',
      //指定服务器端口,如果被占用，会尝试下一个端口
      port: 8080,
      //为true时，如果端口被占用，直接退出
      //strictPort： true, 
      //启用 TLS + HTTP/2
      //https: true, 
      // before(app) {
      //   // 支持在vue-dev-tools中打开组件?
      //   //app.use('/__open-in-editor', openInEditor());
      //   // 数据mock
      //   IS_MOCK &&
      //     mockServer(app, resolve('./mock/'), {
      //       prefix: VITE_APP_API_PREFIX,
      //       delay: 500
      //     });
      // },
      //为开发服务器配置自定义代理规则
      proxy: {
        [VITE_APP_API_PREFIX]: {
          // 你接口的域名
          target: VITE_APP_API_HOST, 
          // secure: false,
          // ws: true,
          // changeOrigin: true,
          // 需要rewrite的,即真实的服务器地址中是否包含api_root
          pathRewrite: {
            [`^${VITE_APP_API_PREFIX}`]: '/api' 
          }
        }
      },
      //为开发服务器配置 CORS。默认启用并允许任何源
      //cors: true
    },
    //大部分第三方包都是 cjs 导出的,基本都是通过require方式导入，
    optimizeDeps: {
      //include该配置强制预构建链接的包
      include: [
        'axios',
        'lodash', 
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        '@ant-design/icons-vue',
      ],
    },
    css:{
      modules: {}, // 配置cssModule https://cn.vitejs.dev/config/#css-modules
      preprocessorOptions:{
        less:{
          additionalData: `@import "@/assets/style/_mixin.less";`,
          javascriptEnabled: true,
          modifyVars:{
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
