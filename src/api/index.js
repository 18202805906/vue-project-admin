let apis = {};
//vite中不支持require写法
// const files = require.context('./', false, /(?<!index)\.[tj]s$/);
// files.keys().forEach(fileName => {
//   const file = files(fileName);
//   const fileModuleName = fileName.replace(/^\.\//, '').replace(/\.\w+$/, '').replace(/.*\//g, '');
//   apis[fileModuleName] = file.default;
// });

const files = import.meta.glob('./*.js');
for(const path in files) {
  const file = files(path);
  const fileModuleName = path.replace(/^\.\//, '').replace(/\.\w+$/, '').replace(/.*\//g, '');
  apis[fileModuleName] = file.default;
}

export default apis;
