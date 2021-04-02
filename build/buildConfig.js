const buildConfig = {
    //默认值为Vite特殊值'modules',另一个特殊的值是'esnext'-仅执行最少的跨语言转换（用于最小化兼容性），并假定支持本机动态导入。
    target: 'modules',
    //是否自动注入动态导入的polyfill。
    polyfillDynamicImport: true,
    //指定输出目录
    outDir: 'dist',
    //指定目录以将生成的动态自由嵌套在下
    assetsDir: 'assets',
    //小于此阈值的导入或引用资产将作为base64 URL内联，以避免额外的http请求。设置为0完全禁用内联。
    assetsInlineLimit: 4096,
    //启用/禁用CSS代码拆分。启用后，在异步块中导入的CSS将内联到异步块本身中，并在加载块时插入。如果禁用，则整个项目中的所有CSS都将提取到一个CSS文件中。
    cssCodeSplit: true,
    //Generate production source maps.生成生产源图。
    sourcemap: false,
    //设置为时true，构建还将生成一个manifest.json文件，其中包含未哈希静态资源文件名到其哈希版本的映射，然后服务器框架可以使用该文件来呈现正确的静态资源链接。
    manifest: false,
    terserOptions: {
        compress: {
          keep_infinity: true,
          // Used to delete console in production environment
          drop_console: true,
          drop_debugger: true,
        },
    },
    rollupOptions:{
        //排除依赖
        // external:{
        //     vue: 'Vue',
        //     'vue-router': 'VueRouter',
        //     vuex: 'Vuex',
        //     axios: 'axios',
        //     nprogress: 'NProgress',
        //     'js-cookie': 'Cookies'
        // }
    }
  };
  export { buildConfig };